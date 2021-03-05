const Customer = require("../../../src/models/customer");
const Database= require("../../../src/database/database");
const customer = new Customer();
const database = new Database();

describe("register", () => {
  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await customer.register(data);
    
    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the stored procedure", async () => {
    const data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "pasindu@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

    const result = await customer.register(data);

    expect(result).toHaveProperty("error",true);
  });

  it("should return user object with when success", async () => {
    const data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "dilshan@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

    const result = await customer.register(data);

    expect(result).toHaveProperty("userData");
    expect(result.userData).toHaveProperty("user_id");
    expect(result.userData).toHaveProperty("`first_name`","Dilshan");
    expect(result.userData).toHaveProperty("`last_name`","Senarath");
    expect(result.userData).toHaveProperty("user_type","customer");
    expect(result.userData).toHaveProperty("`email`","dilshan@gmail.com");

    await database.delete("customer",["user_id","=",result.userData.user_id]);
    await database.delete("contact_no",["user_id","=",result.userData.user_id]);
    await database.delete("useracc",["user_id","=",result.userData.user_id]);
  });
});
