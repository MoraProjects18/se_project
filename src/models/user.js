const Joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity").default;
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
        first_name: Joi.string().min(3).max(200).required().label("First Name"),
        last_name: Joi.string().min(3).max(200).required().label("Last Name"),
        email: Joi.string().min(5).max(255).email().required().label("Email"),
        password: passwordComplexity(),
        NIC: Joi.string().min(10).max(12).required().label("NIC Number"),
        license_number: Joi.string()
          .length(8)
          .required()
          .label("License Number"),
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

    //call register_new_customer stored procedure
    result = await _database
      .get(this)
      .call("register_new_customer", [
        data.email,
        data.password,
        data.NIC,
        data.first_name,
        data.last_name,
        data.license_number,
      ]);
    // .create("useracc", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        userData: result.result[0][0],
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }
}

module.exports = User;
