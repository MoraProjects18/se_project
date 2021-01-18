const Joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity").default;
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _validate = new WeakMap();

class Staff {
  constructor() {
    _database.set(this, new Database());

    _schema.set(this, Joi.object ({
        user_id: Joi.string().required().label("user_id"),
        employee_id: Joi.string().required().label("employee_id"),
        first_name: Joi.string().min(3).max(200).required().label("First Name"),
        last_name: Joi.string().min(3).max(200).required().label("Last Name"),
        email: Joi.string().min(5).max(255).email().required().label("Email"),
        password: passwordComplexity(),
        NIC: Joi.string().min(10).max(12).required().label("NIC Number"),
        role: Joi.string().required().label("role"),
        branch_id: Joi.string().required().label("branch id"),
      }).options({ abortEarly: false })
      );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
  }

  async register(data) {
    //validate data
    let result = await _validate.get(this)(data);
    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));
    
    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;

    // call register_new_staff stored procedure
    result = await _database
      .get(this)
      .call("register_new_staff", [
        data.user_id,
        data.employee_id,
        data.email,
        data.password,
        data.NIC,
        data.first_name,
        data.last_name,
        data.role,
        data.branch_id
      ]);

    return new Promise((resolve) => {
      let obj = {
        // userData: result.result[0],
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async show_profile(data) {
    //validate data
    let result = await _validate.get(this)(data);
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //call show_user_profile stored procedure
    result = await _database
      .get(this)
      .call("show_user_profile", [
        data.user
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

module.exports = Staff;
