const bcrypt = require("bcrypt");
const Joi = require("joi");
const _ = require("lodash");
const Database = require("../database/database");
const _database = new WeakMap();

class User {
  constructor() {
    _database.set(this, new Database());
  }

  get databaseConnection() {
    return _database.get(this);
  }

  async login(data) {
    const validateResults = Joi.object({
      email: Joi.string().min(5).max(255).email().required().label("Email"),
      password: Joi.string().required().label("Password"),
    }).validate(data);

    if (validateResults.error)
      return new Promise((resolve) =>
        resolve({ validationError: validateResults.error })
      );

    if (_database.get(this).connectionError)
      return new Promise((resolve) => resolve({ connectionError: true }));

    const userData = await _database
      .get(this)
      .readSingleTable(
        "useracc",
        ["user_id", "first_name", "last_name", "user_type", "password"],
        ["email", "=", data.email]
      );

    if (userData.error || !userData.result[0])
      return new Promise((resolve) => resolve({ allowAccess: false }));

    const isCompare = await bcrypt.compare(
      data.password,
      userData.result[0]["password"]
    );

    if (!isCompare)
      return new Promise((resolve) => resolve({ allowAccess: false }));

    if (userData.result[0]["user_type"] === "customer") {
      const customerData = await _database
        .get(this)
        .readSingleTable(
          "customer",
          ["email_verification"],
          ["user_id", "=", userData.result[0]["user_id"]]
        );

      if (customerData.error || !customerData.result[0])
        return new Promise((resolve) => resolve({ allowAccess: false }));

      userData.result[0]["email_verification"] =
        customerData.result[0]["email_verification"];

      return new Promise((resolve) =>
        resolve({
          allowAccess: true,
          tokenData: _.pick(userData.result[0], [
            "user_id",
            "first_name",
            "last_name",
            "user_type",
            "email_verification",
          ]),
        })
      );
    }

    return new Promise((resolve) =>
      resolve({
        allowAccess: true,
        tokenData: _.pick(userData.result[0], [
          "user_id",
          "first_name",
          "last_name",
          "user_type",
        ]),
      })
    );
  }
}

module.exports = User;
