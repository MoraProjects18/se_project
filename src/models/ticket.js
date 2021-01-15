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
                user_id:Joi.number().required(),
                status:Joi.string().min(4).max(6).required(),
                start_time:Joi.date().required(),
                end_time:Joi.date().required(),
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

        _validateID.set(this, (object) => {
            return _schemaID.get(this).validate(object);
        });
    }

    async Initiate(data) {
        //validate data
        console.log(data);
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


    async GetByUserId(data) {
        let validateResult = await _validateID.get(this)(data);
        if (validateResult.error)
            return new Promise((resolve) => resolve({ validationError: result }));

        //call readSingleTable function of database class
        const resultdata = await _database
            .get(this)
            .readSingleTable("ticket", "*", ["user_id", "=", data.user_id]);
        //console.log(resultdata);
        return new Promise((resolve) => {
            let obj = {
                connectionError: _database.get(this).connectionError,
            };
            resultdata.error ? (obj.error = true) : (obj.error = false, obj.result =resultdata.result );
            //console.log(obj);
            resolve(obj);
        });
    }

    async Close(data) {
        //validate the ticket id
        let validateResult = await _validateID.get(this)(data);
        if (validateResult.error)
            return new Promise((resolve) => resolve({ validationError: result }));

        //call update function of database class
        const result = await _database
            .get(this)
            .update("ticket",
                ["status", "closed"  ],
                ["ticket_id", "=", data.ticket_id]);

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
