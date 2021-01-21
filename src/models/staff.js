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
        contact_no: Joi.string().required().label("contact_no"),
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
        data.branch_id,
        data.contact_no
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
    let result="" ;
    // let result = await _validate.get(this)(data);
    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));
    

    // call show_staff_profile stored procedure
    result = await _database
      .get(this)
      .call("show_staff_profile",[data]);

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

  async edit_profile(data,user_id) {
    //validate data
    let result = await _validate.get(this)(data);

    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));
    
    
    // call register_new_staff stored procedure
    result = await _database
      .get(this)
      .call("update_user",[user_id,data.email,data.first_name,data.last_name,data.contact_no]);

      return new Promise((resolve) => {
        let obj = {
          connectionError: _database.get(this).connectionError,
        };
        result.error ? (obj.error = true) : (obj.error = false);
        resolve(obj);
      });
  }


  async change_pass(data,user_id) {
    //validate data
    let result = await _validate.get(this)(data);
    // if (result.error)
    //   return new Promise((resolve) => resolve({ validationError: result }));
  
    let c_password= "";
    c_password = await _database
    .get(this)
    .readSingleTable("useracc","password",["user_id","=",user_id]);
    
    const salt = await bcrypt.genSalt(10);
    c_password=c_password.result[0].password;
  
    const hashedPassword1 = await bcrypt.hash(data.new_password, salt);
    data.new_password = hashedPassword1;
    const validPassword = await bcrypt.compare(data.current_password, c_password);
    console.log(validPassword);
    if ( validPassword){
      const result = await _database
        .get(this)
        .update(
          "useracc",
          ["password", data.new_password],
          ["user_id", "=", 6]
        );
        return new Promise((resolve) => {
          let obj = {
            connectionError: _database.get(this).connectionError,
          };
          result.error ? (obj.error = true) : (obj.error = false);
          resolve(obj);
        });
    }
    else{
    return new Promise((resolve) => {
      let obj ="Incorrect Password";
      resolve(obj);
    });
    }
   
  }
}
module.exports = Staff;
