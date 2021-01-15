const Joi = require("joi");
const bcrypt = require("bcrypt");
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _validate = new WeakMap();

class User {
  constructor() {
    _database.set(this, new Database());

    _schema.set(
      this,
      Joi.object({
        first_name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(10).max(255).email().required(),
        password: Joi.string().min(5).max(30).required(),
      }).options({ abortEarly: false })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
  }

  async register(data) {
    //validate data
    let result = await _validate.get(this)(data);
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;

    //call create function of database class
    result = await _database
      .get(this)
      .create("useracc", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }
}

module.exports = User;
