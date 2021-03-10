const Customer = require("../../../src/models/customer");
const Database = require("../../../src/database/database");
const bcrypt = require("bcrypt");
const customer = new Customer();
const database = new Database();
const _ = require("lodash");

describe("register", () => {
  let originalValue;

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

    expect(result).toHaveProperty("error", true);
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
    expect(result.userData).toHaveProperty("`first_name`", "Dilshan");
    expect(result.userData).toHaveProperty("`last_name`", "Senarath");
    expect(result.userData).toHaveProperty("user_type", "customer");
    expect(result.userData).toHaveProperty("`email`", "dilshan@gmail.com");

    await database.delete("customer", [
      "user_id",
      "=",
      result.userData.user_id,
    ]);
    await database.delete("contact_no", [
      "user_id",
      "=",
      result.userData.user_id,
    ]);
    await database.delete("useracc", ["user_id", "=", result.userData.user_id]);
  });
});

describe("verifyEmail", () => {
  let data;
  let user_id;
  let encrypted_user_id;
  let originalFunc;

  beforeEach(async () => {
    data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "dilshan@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

    const result = await customer.register(data);

    user_id = result.userData.user_id;

    const salt = await bcrypt.genSalt(10);
    encrypted_user_id = await bcrypt.hash(`${result.userData.user_id}`, salt);
  });

  afterEach(async () => {
    await database.delete("customer", ["user_id", "=", user_id]);
    await database.delete("contact_no", ["user_id", "=", user_id]);
    await database.delete("useracc", ["user_id", "=", user_id]);
  });

  it("should return validation error for invalid email", async () => {
    const email = "";

    const result = await customer.verifyEmail(email, encrypted_user_id);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when the email is incorrect", async () => {
    const email = "dilsha@gmail.com";

    const result = await customer.verifyEmail(email, encrypted_user_id);

    expect(result).toHaveProperty("error", true);
  });

  it("should return repeating request error when the user is already confirmed the email", async () => {
    await customer.databaseConnection.update(
      "customer",
      ["email_verification", true],
      ["user_id", "=", user_id]
    );

    const result = await customer.verifyEmail(data.email, encrypted_user_id);

    expect(result).toHaveProperty("repeatingRequest", true);
  });

  it("should return error when the encrypted user id is incorrect", async () => {
    encrypted_user_id = "";

    const result = await customer.verifyEmail(data.email, encrypted_user_id);

    expect(result).toHaveProperty("notValid", true);
  });

  it("should return error when the update query can't proceed", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = customer.databaseConnection.update;
    customer.databaseConnection.update = mockFunc;

    const result = await customer.verifyEmail(data.email, encrypted_user_id);

    expect(result).toHaveProperty("error", true);

    customer.databaseConnection.update = originalFunc;
  });

  it("should return empty object when the verify is successed", async () => {
    const result = await customer.verifyEmail(data.email, encrypted_user_id);

    expect(result).toEqual({});
  });
});

describe("show_profile", () => {
  let data;
  let user_id;

  beforeEach(async () => {
    data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "dilshan@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

    const result = await customer.register(data);

    user_id = result.userData.user_id;

    await customer.databaseConnection.update(
      "customer",
      ["email_verification", true],
      ["user_id", "=", user_id]
    );
  });

  afterEach(async () => {
    await database.delete("customer", ["user_id", "=", user_id]);
    await database.delete("contact_no", ["user_id", "=", user_id]);
    await database.delete("useracc", ["user_id", "=", user_id]);
  });

  it("should return error when the user id is incorrect", async () => {
    const user_id = "";

    const result = await customer.show_profile(user_id);

    expect(result).toHaveProperty("error", true);
    expect(result).toHaveProperty("connectionError", false);
  });

  it("should return empty object when the verify is successed", async () => {
    const result = await customer.show_profile(user_id);

    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("connectionError", false);
  });
});

describe("edit_profile", () => {
  let data;
  let user_id;
  let originalFunc;

  beforeEach(async () => {
    data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "dilshan@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

    const result = await customer.register(data);

    user_id = result.userData.user_id;
  });

  afterEach(async () => {
    await database.delete("customer", ["user_id", "=", user_id]);
    await database.delete("contact_no", ["user_id", "=", user_id]);
    await database.delete("useracc", ["user_id", "=", user_id]);
  });

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await customer.edit_profile(data, user_id);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when the update query can't proceed", async () => {
    const user_id = "";

    const result = await customer.edit_profile(
      _.pick(data, ["first_name", "last_name", "contact_no"]),
      user_id
    );

    expect(result).toHaveProperty("error", true);
    expect(result).toHaveProperty("connectionError", false);
  });

  it("should return non error object when the success", async () => {
    const result = await customer.edit_profile(
      _.pick(data, ["first_name", "last_name", "contact_no"]),
      user_id
    );

    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("connectionError", false);
  });
});

describe("change_pass", () => {
  let data;
  let user_id;
  let originalFunc;
  let new_pass;

  beforeEach(async () => {
    data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "dilshan@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

    const result = await customer.register(data);

    user_id = result.userData.user_id;

    new_pass = "@Password2";
  });

  afterEach(async () => {
    await database.delete("customer", ["user_id", "=", user_id]);
    await database.delete("contact_no", ["user_id", "=", user_id]);
    await database.delete("useracc", ["user_id", "=", user_id]);
  });

  it("should return validation error for invalid new password", async () => {
    const passData = { new_password: "", current_password: data.password };

    const result = await customer.change_pass(passData, user_id);

    expect(result).toHaveProperty("validationError");
  });

  it("should return current password error when the current password is incorrect", async () => {
    const passData = { new_password: new_pass, current_password: "" };

    const result = await customer.change_pass(passData, user_id);

    expect(result).toHaveProperty("current_password_error", true);
    expect(result).toHaveProperty("connectionError", false);
  });

  it("should return error object when there is an error to execute update query", async () => {
    data.password = "@Password1";

    const passData = {
      new_password: new_pass,
      current_password: data.password,
    };

    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = customer.databaseConnection.update;
    customer.databaseConnection.update = mockFunc;

    const result = await customer.change_pass(passData, user_id);

    expect(result).toHaveProperty("error", true);
    expect(result).toHaveProperty("connectionError", false);

    customer.databaseConnection.update = originalFunc;
  });

  it("should return non error object when the success", async () => {
    data.password = "@Password1";
    const passData = {
      new_password: new_pass,
      current_password: data.password,
    };

    const result = await customer.change_pass(passData, user_id);

    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("connectionError", false);
  });
});
