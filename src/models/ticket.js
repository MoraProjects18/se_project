const Joi = require("joi");
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _schemaID = new WeakMap();
const _validate = new WeakMap();
const _validateID = new WeakMap();

class Ticket {
  constructor() {
    _database.set(this, new Database());

    _schema.set(
      this,
      Joi.object({
        user_id: Joi.number().required(),
        status: Joi.string().min(4).max(6).required(),
        branch_id: Joi.number().required(),
        start_date: Joi.date().required(),
        start_time: Joi.string().min(4).max(6).required(),
      }).options({ abortEarly: false })
    );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });

    //used to vaidate ticket id
    _schemaID.set(
      this,
      Joi.object({
        ticket_id: Joi.number().required(),
      })
    );


  }

  async Initiate(data) {
    //validate data

    let result = await _validate.get(this)(data);
    if (result.error)
      return new Promise((resolve) => resolve({ validationError: result }));

    //call create function of database class
    result = await _database
      .get(this)
      .create("ticket", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async GetBranch() {
    const resultdata = await _database
      .get(this)
      .readSingleTable("branch", ["branch_id", "branch_name"]);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      resultdata.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.result = resultdata.result));

      resolve(obj);
    });
  }
  async GetTime(branch_id, start_date) {
    const resultdata = await _database
      .get(this)
      .call("get_timeslots", [branch_id, start_date]);
 
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      resultdata.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.result = resultdata.result));

      resolve(obj);
    });
  }

  async Close(data) {
    //validate the ticket id

    //call update function of database class
    const result = await _database
      .get(this)
      .update("ticket", ["status", "Closed"], ["ticket_id", "=", data]);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  async UserTicket(user_id) {
    const result = await _database.get(this).call("get_user_tickets", user_id);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result[0]));
      resolve(obj);
    });
  }

  async TodayTicket(branch_id) {
    const result = await _database
      .get(this)
      .call("get_today_tickets", branch_id);

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error
        ? (obj.error = true)
        : ((obj.error = false), (obj.resultData = result.result[0]));
      resolve(obj);
    });
  }


}

module.exports = Ticket;
