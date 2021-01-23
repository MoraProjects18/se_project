const Joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity").default;
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _validate = new WeakMap();
const _ = require("lodash");
const { valid } = require("joi");

class Staff {
  constructor() {
    _database.set(this, new Database());

    _schema.set(this, {
      employee_id: Joi.string().required().label("employee_id"),
      first_name: Joi.string()
        .alphanum()
        .min(3)
        .max(200)
        .required()
        .label("First Name"),
      last_name: Joi.string()
        .alphanum()
        .min(3)
        .max(200)
        .required()
        .label("Last Name"),
      email: Joi.string().min(5).max(255).email().required().label("Email"),
      password: passwordComplexity(undefined, "Password"),
      NIC: Joi.string().min(10).max(12).required().label("NIC Number"),
      user_type: Joi.string().required().label("User Type"),
      branch_id: Joi.string().required().label("Branch Id"),
      contact_no: Joi.string().min(9).required().label("Contact No"),
    });

    //joi validate function
    _validate.set(this, (object, schema) => {
      return schema.validate(object);
    });
  }

  async register(data) {
    //validate data
    let result = await _validate.get(this)(
      data,
      Joi.object(_schema.get(this)).options({ abortEarly: false })
    );
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;

    // call register_new_staff stored procedure
    result = await _database
      .get(this)
      .call("register_new_staff", [
        data.employee_id,
        data.email,
        data.password,
        data.NIC,
        data.first_name,
        data.last_name,
        data.user_type,
        data.branch_id,
        data.contact_no,
      ]);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async show_profile(data) {
    let result = "";
    // call show_staff_profile stored procedure
    result = await _database.get(this).call("show_staff_profile", [data]);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.result = result.result));
      resolve(obj);
    });
  }

  async edit_profile(data, user_id) {
    //validate data
    let result = await _validate.get(this)(
      data,
      Joi.object(
        _.pick(_schema.get(this), ["first_name", "last_name", "contact_no"])
      ).options({ abortEarly: false })
    );

    if (result.error) {
      return new Promise((resolve) =>
        resolve({ validationError: result.error })
      );
    }

    //call update_user stored procedure
    result = await _database
      .get(this)
      .call("update_user", [
        user_id,
        data.first_name,
        data.last_name,
        data.contact_no,
      ]);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async change_pass(data, user_id) {
    //validate data
    let schema = {
      new_password: _.pick(_schema.get(this), ["password"]).password,
    };
    let result = await _validate.get(this)(
      _.pick(data, ["new_password"]),
      Joi.object(schema).options({
        abortEarly: false,
      })
    );
    if (result.error) {
      console.log("Validation error", result.error);
      return new Promise((resolve) =>
        resolve({ validationError: result.error })
      );
    }

    let c_password = "";
    c_password = await _database
      .get(this)
      .readSingleTable("useracc", "password", ["user_id", "=", user_id]);

    const salt = await bcrypt.genSalt(10);
    c_password = c_password.result[0].password;

    const hashedPassword1 = await bcrypt.hash(data.new_password, salt);
    data.new_password = hashedPassword1;
    const validPassword = await bcrypt.compare(
      data.current_password,
      c_password
    );
    console.log(
      "Passowrddddddd",
      validPassword,
      data.current_password,
      c_password
    );
    if (validPassword) {
      const result = await _database
        .get(this)
        .update(
          "useracc",
          ["password", data.new_password],
          ["user_id", "=", user_id]
        );
      return new Promise((resolve) => {
        let obj = {
          connectionError: _database.get(this).connectionError,
        };
        result.error ? (obj.error = true) : (obj.error = false);
        resolve(obj);
      });
    } else {
      return new Promise((resolve) => {
        let obj = {
          connectionError: _database.get(this).connectionError,
          current_password_error: true,
        };
        resolve(obj);
      });
    }
  }

  async get_branch_id(user_id) {
    console.log("model work",user_id);
    let result = await _database
      .get(this)
      .readSingleTable("staff", "branch_id", ["user_id", "=", user_id]);
    console.log(result);
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.result = result.result));

      resolve(obj);
    });
  }
}
module.exports = Staff;
