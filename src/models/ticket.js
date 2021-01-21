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

            }).options({abortEarly: false})
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

        _validateID.set(this, (object) => {
            return _schemaID.get(this).validate(object);
        });
    }

    async Initiate(data) {
        //validate data
        console.log(data);
        let result = await _validate.get(this)(data);
        if (result.error)
            return new Promise((resolve) => resolve({validationError: result}));

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
            .readSingleTable("branch", ["branch_id","branch_name"] );
        //console.log(resultdata);

        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            resultdata.error ? (obj.error = true) : (obj.error = false, obj.result = resultdata.result);

            //console.log(obj);
            resolve(obj);
        });
    }
    async GetTime(branch_id,start_date) {

        const resultdata = await _database
            .get(this)
            .call("get_timeslot",[branch_id,start_date]);
        //console.log(resultdata);

        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            resultdata.error ? (obj.error = true) : (obj.error = false, obj.result = resultdata.result);

            //console.log(obj);
            resolve(obj);
        });
    }
    async Close(data) {
        //validate the ticket id
        let validateResult = await _validateID.get(this)(data);
        if (validateResult.error)
            return new Promise((resolve) => resolve({validationError: result}));

        //call update function of database class
        const result = await _database
            .get(this)
            .update("ticket",
                ["status", "closed"],
                ["ticket_id", "=", data.ticket_id]);

        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            result.error ? (obj.error = true) : (obj.error = false);
            resolve(obj);
        });
    }

    async UserTicket() {
        const result = await _database
            .get(this)
            .call("get_user_tickets");
        //console.log(result.result[0]);
        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            result.error ? (obj.error = true) : (obj.error = false , obj.resultData = result.result[0]);
            resolve(obj);
        });

    }

    async TodayTicket() {
        const result = await _database
            .get(this)
            .call("get_today_tickets");
        //console.log(result.result[0]);
        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            result.error ? (obj.error = true) : (obj.error = false , obj.resultData = result.result[0]);
            resolve(obj);
        });

    }

    async autoCancel(data) {
        setTimeout(closeTicket(data), 600000);
    }

    async closeTicket(data) {
        //call update function of database class
        const result = await _database
            .get(this)
            .update(
                "ticket",
                ["status", "closed", "end_time", getDate()],
                ["ticket_id", "=", data.ticket_id]
            );

        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            result.error ? (obj.error = true) : (obj.error = false);
            resolve(obj);
        });


    }
}
module.exports = Ticket;
