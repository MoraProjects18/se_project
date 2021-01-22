const Joi = require("joi");
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _validate = new WeakMap();

class Vehicle {
  constructor() {
    _database.set(this, new Database());

    _schema.set(
      this,
      Joi.object({
        user_id: Joi.number().min(1).required(),
        registration_number: Joi.string().required(),
        engine_number: Joi.string().required(),
        model_number: Joi.string().required(),
        model: Joi.string().required(),
      }).options({ abortEarly: false })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
  }
  async AddVehicle(data) {
    let result = await _validate.get(this)(data);
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    result = await _database
      .get(this)
      .create("vehicle", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        data: result.result,
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }
  async GetVehicle(data) {
    const result = await _database
      .get(this)
      .readSingleTable(
        "vehicle",
        [
          "registration_number",
          "user_id",
          "engine_number",
          "model_number",
          "model",
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

module.exports = Vehicle;
