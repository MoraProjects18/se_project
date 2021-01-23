const bcrypt = require("bcrypt");
const User = require("./user");
const _ = require("lodash");
const passwordComplexity = require("joi-password-complexity").default;
const Joi = require("joi");
const _schema = new WeakMap();
const _validate = new WeakMap();
const Database = require("../database/database");
const _database = new WeakMap();

class Customer extends User {
  constructor() {
    super();
    _database.set(this, new Database());
    //all data fields of a customer
    _schema.set(this, {
      first_name: Joi.string().min(3).max(200).required().label("First Name"),
      last_name: Joi.string().min(3).max(200).required().label("Last Name"),
      email: Joi.string().min(5).max(255).email().required().label("Email"),
      password: passwordComplexity(undefined, "Password"),
      NIC: Joi.string().min(10).max(12).required().label("NIC Number"),
      license_number: Joi.string().length(8).required().label("License Number"),
      contact_no: Joi.string().min(9).required().label("Contact Number"),
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
      return new Promise((resolve) =>
        resolve({ validationError: result.error })
      );

    //encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    data.password = hashedPassword;

    //call register_new_customer stored procedure
    result = await this.databaseConnection.call("register_new_customer", [
      data.email,
      data.password,
      data.NIC,
      data.first_name,
      data.last_name,
      data.license_number,
      data.contact_no,
    ]);

    return new Promise((resolve) => {
      if (this.databaseConnection.connectionError)
        return resolve({ connectionError: true });
      if (result.error || !result.result[0][0]) return resolve({ error: true });
      return resolve({ userData: result.result[0][0] });
    });
  }

  async verifyEmail(email, encrypted_user_id) {
    //validate the email
    const validateInfo = await _validate.get(this)(
      { email },
      Joi.object(_.pick(_schema.get(this), ["email"])).options({
        abortEarly: false,
      })
    );
    if (validateInfo.error)
      return new Promise((resolve) => {
        resolve({ validationError: validateInfo.error });
      });

    //check database connection
    if (this.databaseConnection.connectionError)
      return new Promise((resolve) => {
        resolve({ connectionError: true });
      });

    //check whether email is already confirmed or not
    const customerData = await this.databaseConnection.readMultipleTable(
      "useracc",
      "inner",
      ["customer", "user_id"],
      ["useracc.user_id", "email_verification"],
      ["email", "=", email]
    );

    if (customerData.error || !customerData.result[0])
      return new Promise((resolve) => {
        resolve({ error: true });
      });

    if (customerData.result[0]["email_verification"])
      return new Promise((resolve) => {
        resolve({ repeatingRequest: true });
      });

    //compare id with the database user_id
    const isValid = await bcrypt.compare(
      `${customerData.result[0]["user_id"]}`,
      encrypted_user_id
    );
    if (!isValid)
      return new Promise((resolve) => {
        resolve({ notValid: true });
      });

    //update data base as email was confirmed
    const result = await this.databaseConnection.update(
      "customer",
      ["email_verification", true],
      ["user_id", "=", customerData.result[0]["user_id"]]
    );

    return new Promise((resolve) => {
      if (result.error) {
        resolve({ error: true });
      } else {
        resolve({});
      }
    });
  }

  async show_profile(data) {
    //validate data
    let result = "";
    // let result = await _validate.get(this)(data);
    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));

    //encrypt the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(data.password, salt);
    // data.password = hashedPassword;

    // call register_new_staff stored procedure
    result = await _database.get(this).call("show_customer_profile", [data]);

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
      Joi.object(_schema.get(this)).options({ abortEarly: false })
    );

    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));

    // call register_new_staff stored procedure
    result = await _database
      .get(this)
      .call("update_user", [
        user_id,
        data.email,
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
    let result = await _validate.get(this)(
      data,
      Joi.object(_schema.get(this)).options({ abortEarly: false })
    );
    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));

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
        let obj = "Incorrect Password";
        resolve(obj);
      });
    }
  }
}
module.exports = Customer;
