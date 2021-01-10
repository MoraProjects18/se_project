const Joi = require("joi");
const Database = require("../database/database");
const _database = new WeakMap();
const _schemaNew = new WeakMap();
const _schemaSearch = new WeakMap();
const _validate = new WeakMap();
const _validateSearch = new WeakMap();

class Invoice {
  constructor() {
    _database.set(this, new Database());
    _schemaNew.set(
      this,
      Joi.object({
        invoice_id: Joi.string().required(),
        service_order_id: Joi.string().required(),
        payment_amount: Joi.number().required(),
      })
    );

    _validate.set(this, (object) => {
      return _schemaNew.get(this).validate(object);
    });

    _schemaSearch.set(
      this,
      Joi.object({
        invoice_id: Joi.string().required(),
      })
    );

    _validateSearch.set(this, (object) => {
      return _schemaSearch.get(this).validate(object);
    });
  }

  //Create new Invoice put in service order
  async createInvoice(data) {
    //Validate data
    let result = await _validate.get(this)(data);
    if (result.error) {
      return new Promise((resolve) => resolve({ validationError: result }));
    }

    //Call create function of DB
    result = await _database
      .get(this)
      .create("invoice", Object.keys(data), Object.values(data));

    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };

      result.error ? (obj.error = true) : (obj.error = false);
      resolve(obj);
    });
  }

  //Search invoice
  async searchInvoice(data) {}
}

module.exports = Invoice;
