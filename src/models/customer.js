const Joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity").default;
const Database = require("../database/database");
const _database = new WeakMap();
const _schema = new WeakMap();
const _validate = new WeakMap();

class Customer {
  constructor() {
    _database.set(this, new Database());

    _schema.set(this, Joi.object ({
        user_id: Joi.string().required().label("user_id"),
        first_name: Joi.string().min(3).max(200).required().label("First Name"),
        last_name: Joi.string().min(3).max(200).required().label("Last Name"),
        email: Joi.string().min(5).max(255).email().required().label("Email"),
        password: passwordComplexity(),
        NIC: Joi.string().min(10).max(12).required().label("NIC Number"),
        license_number: Joi.string().length(8).required().label("License Number"),
      }).options({ abortEarly: false })
      );

    _validate.set(this, (object) => {
      return _schema.get(this).validate(object);
    });
  }

  

  async show_profile(data) {
    //validate data
    let result="" ;
    // let result = await _validate.get(this)(data);
    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));
    
    //encrypt the password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(data.password, salt);
    // data.password = hashedPassword;

    // call register_new_staff stored procedure
    result = await _database
      .get(this)
      .call("show_customer_profile",[data]);

      return new Promise((resolve) => {
        let obj = {
          connectionError: _database.get(this).connectionError,
        };
        result.error
          ? (obj.error = true)
          : ((obj.error = false), (obj.result = result.result));
        //console.log(obj);
        resolve(obj);
      });

  }
}

module.exports = Customer;
