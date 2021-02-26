const Joi = require("joi"); //Validations
const Database = require("../database/database");
const _database = new WeakMap();
const _schemaNew = new WeakMap();
const _schemaSearch = new WeakMap();
const _validate = new WeakMap();
const _validateSearch = new WeakMap();
const _schemaSO = new WeakMap();
const _validateSO = new WeakMap();

class Invoice {
  constructor() {
    _database.set(this, new Database());

    _schemaNew.set(
      this,
      Joi.object({
        service_order_id: Joi.number().min(1000).required(),
        payment_amount: Joi.number().required(),
      })
    );

    _validate.set(this, (object) => {
      return _schemaNew.get(this).validate(object);
    });

    _schemaSearch.set(
      this,
      Joi.object({
        invoice_id: Joi.number().min(1000).required(),
      })
    );

    _validateSearch.set(this, (object) => {
      return _schemaSearch.get(this).validate(object);
    });

    _schemaSO.set(
      this,
      Joi.object({
        service_order_id: Joi.number().min(1000).required(),
      })
    );

    _validateSO.set(this, (object) => {
      return _schemaSO.get(this).validate(object);
    });
  }

  //Create new Invoice put in service order
  async createInvoice(data) {
    let valid = await _validate.get(this)(data);
    if (valid.error) {
      return new Promise((resolve) => resolve({ validationError: valid }));
    }

    //Call create function of DB
    const result = await _database
      .get(this)
      .create("invoice", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  //Search invoice
  async getInvoice(data) {
    let valid = await _validateSearch.get(this)(data);
    if (valid.error) {
      return new Promise((resolve) => resolve({ validationError: valid }));
    }

    const result = await _database
      .get(this)
      .readSingleTable(
        "invoice",
        ["invoice_id", "service_order_id", "payment_amount"],
        ["invoice_id", "=", data.invoice_id],
        ["invoice_id"]
      );
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      if (result.error) {
        obj.error = true;
      } else {
        obj.error = false;
        obj.result = result.result;
      }
      resolve(obj);
    });
  }

  async getInvoiceByServiceOrder(data) {
    let valid = await _validateSO.get(this)(data);
    if (valid.error) {
      return new Promise((resolve) => resolve({ validationError: valid }));
    }

    const result = await _database
      .get(this)
      .readSingleTable(
        "invoice",
        ["invoice_id", "service_order_id", "payment_amount"],
        ["service_order_id", "=", data.service_order_id],
        ["service_order_id"],
        [1]
      );
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      if (result.error) {
        obj.error = true;
      } else {
        obj.error = false;
        obj.result = result.result;
      }
      resolve(obj);
    });
  }

  //Search invoice
  async getSOUser(data) {
    let valid = await _validateSO.get(this)({service_order_id:data});
    if (valid.error) {
      return new Promise((resolve) => resolve({ validationError: valid }));
    }
    const result = await _database
      .get(this)
      .readMultipleTable(
        "service_order",
        "inner",
        ["useracc", "user_id"],
        [
          "service_order_id",
          "vehicle_number",
          "start_date",
          "status",
          "first_name",
          "last_name",
          "NIC",
          "email",
        ],
        ["service_order_id", "=", data]
      );

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      if (result.error) {
        obj.error = true;
      } else {
        obj.error = false;
        obj.result = result.result;
      }
      resolve(obj);
    });
  }
}

module.exports = Invoice;
