const Joi = require("joi"); //Validations
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap(); //validation schemas
const _validate = new WeakMap();

class Skill {
  constructor() {
    _database.set(this, new Database());
    _schemaNew.set(
      this,
      Joi.object({
        invoice_id: Joi.string().required(),
      })
    );

    _schema.set(
      this,
      Joi.object({
        name: Joi.string().required(),
        user_id: Joi.string().required(),
        validated_by: Joi.array().required(),
      })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
  }

  async addSkill(data) {
    let result = await _validate.get(this, data);
    if (result.error) {
      return new Promise((resolve) => resolve({ validationError: result }));
    }

    result = await _database
      .get(this)
      .create("skill", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }
}

module.exports = Invoice;
