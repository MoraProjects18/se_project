const Joi = require("joi");
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _schemaID = new WeakMap();
const _validate = new WeakMap();
const _validateID = new WeakMap();

class ServiceOrder {
  constructor() {
    _database.set(this, new Database());
    //used in insert operation
    _schema.set(
      this,
      Joi.object({
        user_id: Joi.number().min(1).max(10).required(),
        vehicle_number: Joi.string().min(5).max(30).required(),
        start_date: Joi.date().greater('now').required(),
        end_date: Joi.date().greater('now').allow('', null), //end date time should be update when closing the so
        status: Joi.string().min(1).max(30).required(),
      }).options({ abortEarly: false })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
    //used to validate service order id
    _schemaID.set(
      this,
      Joi.object({
        service_order_id: Joi.number().required(),
      })
    );

    _validateID.set(this, (object) => {
      return _schemaID.get(this).validate(object);
    });
  }

  async Initiate(data) {
    //validate data
    let result = await _validate.get(this)(data);
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //call create function of database class
    result = await _database
      .get(this)
      .create("service_order", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async GetById(data) {
    let validateResult = await _validateID.get(this)(data);
    if (validateResult.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //call readSingleTable function of database class
    const resultdata = await _database
      .get(this)
      .readSingleTable("service_order", "*", ["service_order_id", "=", data.service_order_id]);
    //console.log(resultdata);
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      resultdata.error ? (obj.error = true) : (obj.error = false, obj.result =resultdata.result );
      //console.log(obj);
      resolve(obj);
    });
  }

  async Close(data) {
    //validate the so id
    let validateResult = await _validateID.get(this)(data);
    if (validateResult.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //call update function of database class
    const result = await _database
      .get(this)
      .update("service_order",  
              ["status", "closed" , "end_date",getDate() ],
              ["service_order_id", "=", data.service_order_id]);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

}

//function to get date and time return format 2021-1-13 18:24:57
function getDate(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  return dateTime;
  }

module.exports = ServiceOrder;
