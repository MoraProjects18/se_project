const Joi = require("joi");
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _validate = new WeakMap();

class ServiceOrder {
  constructor() {
    _database.set(this, new Database());

    _schema.set(
      this,
      Joi.object({
        user_id: Joi.number().min(1).max(10).required(),
        vehicle_number: Joi.string().min(5).max(30).required(),
        start_date: Joi.date().greater('now').required(),
        //end_date: Joi.date().greater('now').allow('', null), //end date time should be update when closing the so
        status: Joi.string().min(1).max(30).required(),
      }).options({ abortEarly: false })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
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
}

module.exports = ServiceOrder;
