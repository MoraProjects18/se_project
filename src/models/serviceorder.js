const Joi = require("joi");
const Database = require("../database/database");
const datetime = require("../utils/datetime");
const _database = new WeakMap();
const _schema = new WeakMap();
const _schemaID = new WeakMap();
const _schemaNIC = new WeakMap();
const _validate = new WeakMap();
const _validateID = new WeakMap();
const _validateNIC = new WeakMap();

class ServiceOrder {
  constructor() {
    _database.set(this, new Database());
    //used in insert operation
    _schema.set(
      this,
      Joi.object({
        user_id: Joi.number().min(1).required(),
        vehicle_number: Joi.string().min(5).max(30).required(),
        start_date: Joi.date().required(),
        end_date: Joi.date().allow("", null), //end date time should be update when closing the so
        payment_amount: Joi.number().min(2).max(10000).required(),
      }).options({ abortEarly: false })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
    //used to validate service order id
    _schemaID.set(
      this,
      Joi.object({
        service_order_id: Joi.number().min(1000).required(),
      })
    );

    _validateID.set(this, (object) => {
      return _schemaID.get(this).validate(object);
    });
    //used to validate NIC
    _schemaNIC.set(
      this,
      Joi.object({
        NIC: Joi.string().alphanum().min(10).max(12).required(),
      })
    );

    _validateNIC.set(this, (object) => {
      return _schemaNIC.get(this).validate(object);
    });
  }

  async Initiate(data) {
    let result = await _validate.get(this)(data);
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));
    //call initiate_so stored procedure
    result = await _database
      .get(this)
      .call("initiate_so", [
        data.user_id,
        data.vehicle_number,
        data.start_date,
        data.payment_amount,
      ]);
    return new Promise((resolve) => {
      let obj = {
        data: result.result[0][0],
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async GetById(data) {
    let validateResult = await _validateID.get(this)(data);
    if (validateResult.error)
      return new Promise((resolve) =>
        resolve({ validationError: validateResult })
      );

    const result = await _database
      .get(this)
      .readMultipleTable(
        "service_order",
        "inner",
        ["invoice", "service_order_id"],
        [
          "service_order_id",
          "user_id",
          "end_date",
          "invoice_id",
          "payment_amount",
        ],
        ["service_order_id", "=", data.service_order_id]
      );
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result));
      resolve(obj);
    });
  }

  async Close(data) {
    //validate the so id
    let validateResult = await _validateID.get(this)(data);
    if (validateResult.error)
      return new Promise((resolve) =>
        resolve({ validationError: validateResult })
      );

    //call update function of database class
    const result = await _database
      .get(this)
      .update(
        "service_order",
        ["status", "Closed", "end_date", datetime()],
        ["service_order_id", "=", data.service_order_id]
      );

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async paySO(data) {
    //validate the so id
    let validateResult = await _validateID.get(this)(data);
    if (validateResult.error)
      return new Promise((resolve) =>
        resolve({ validationError: validateResult })
      );

    //call update function of database class
    const result = await _database
      .get(this)
      .update(
        "service_order",
        ["status", "Paid"],
        ["service_order_id", "=", data.service_order_id]
      );

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async GetFailedSO(data) {
    const result = await _database.get(this).call("get_failedso", [data.NIC]);
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result[0]));
      resolve(obj);
    });
  }

  //gives all the details of the today opened so
  async TodaySO() {
    const result = await _database.get(this).call("get_todayso");
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result[0]));
      resolve(obj);
    });
  }

  async GetCustomer(data) {
    let validateR = await _validateNIC.get(this)(data);
    if (validateR.error)
      return new Promise((resolve) => resolve({ validationError: validateR }));

    const result = await _database
      .get(this)
      .readSingleTable(
        "useracc",
        ["user_id", "NIC", "first_name", "last_name", "email", "user_type"],
        ["NIC", "=", data.NIC]
      );
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result));
      resolve(obj);
    });
  }

  async GetMySO(data) {
    const result = await _database
      .get(this)
      .readMultipleTable(
        "service_order",
        "inner",
        ["invoice", "service_order_id"],
        [
          "service_order_id",
          "vehicle_number",
          "start_date",
          "end_date",
          "status",
          "invoice_id",
          "payment_amount",
        ],
        ["user_id", "=", data]
      );
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result));
      resolve(obj);
    });
  }
}

module.exports = ServiceOrder;
