const Database = require("../../../src/database/database");
const database = new Database();
const Staff = require("../../../src/models/staff");
const staff = new Staff();

const data = {
  employee_id: "1000",
  first_name: "Kalhara",
  last_name: "Gamnayake",
  email: "kalhara@gmail.com",
  password: "@Password1",
  NIC: "771234568V",
  user_type: "cashier",
  branch_id: "1",
  contact_no: "07457896856",
};

const removeUser = async () => {
  const result = await database.readSingleTable("useracc", "user_id", [
    "email",
    "=",
    data.email,
  ]);

  user_id = result.result[0].user_id;

  await database.delete("staff", ["user_id", "=", user_id]);
  await database.delete("contact_no", ["user_id", "=", user_id]);
  await database.delete("useracc", ["user_id", "=", user_id]);
};

describe("register", () => {
  afterEach(() => {
    data.password = "@Password1";
    data.email = "kalhara@gmail.com";
  });

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await staff.register(data);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the stored procedure", async () => {
    data.email = "admin1@gmail.com";

    const result = await staff.register(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);
  });

  it("should return non-error object when success", async () => {
    const result = await staff.register(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);

    removeUser();
  });
});

describe("show_profile", () => {
  let originalFunc;
  let user_id = 7;

  it("should return error when there is an error to execute the stored procedure", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = staff.databaseConnection.call;
    staff.databaseConnection.call = mockFunc;

    const result = await staff.show_profile(user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    staff.databaseConnection.call = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await staff.show_profile(user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("result");
  });
});

describe("edit_profile", () => {
  let data = {
    first_name: "Dilshan",
    last_name: "Senarath",
    contact_no: "0784456892",
  };
  let originalFunc;
  let user_id = 7;

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await staff.edit_profile(data, user_id);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the stored procedure", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = staff.databaseConnection.call;
    staff.databaseConnection.call = mockFunc;

    const result = await staff.edit_profile(data,user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    staff.databaseConnection.call = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await staff.edit_profile(data,user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
  });
});

describe("change_pass", () => {
  let data;
  let user_id;
  let originalFunc;
  let new_pass;
  let current_pass;

  beforeEach(async () => {
    user_id = 7;

    new_pass = "@Password2";
    current_pass = "@Password1"
  });

  const restore_password = async () => {
    new_pass = "@Password2";
    current_pass = "@Password1"

    await staff.change_pass({ new_password: current_pass, current_password: new_pass }, user_id);
  }

  it("should return validation error for invalid new password", async () => {
    const passData = { new_password: "", current_password: current_pass };

    const result = await staff.change_pass(passData, user_id);

    expect(result).toHaveProperty("validationError");
  });

  it("should return current password error when the current password is incorrect", async () => {
    const passData = { new_password: new_pass, current_password: "" };

    const result = await staff.change_pass(passData, user_id);

    expect(result).toHaveProperty("current_password_error", true);
    expect(result).toHaveProperty("connectionError", false);
  });

  it("should return error object when there is an error to execute update query", async () => {
    const passData = {
      new_password: new_pass,
      current_password: current_pass,
    };

    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = staff.databaseConnection.update;
    staff.databaseConnection.update = mockFunc;

    const result = await staff.change_pass(passData, user_id);

    expect(result).toHaveProperty("error", true);
    expect(result).toHaveProperty("connectionError", false);

    staff.databaseConnection.update = originalFunc;
  });

  it("should return non error object when the success", async () => {
    const passData = {
      new_password: new_pass,
      current_password: current_pass,
    };

    const result = await staff.change_pass(passData, user_id);

    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("connectionError", false);

    await restore_password();
  });
});

describe("get_branch_id", () => {
  let user_id = 7;
  let originalFunc;

  afterEach(()=>{
    user_id = 7;
  })

  it("should return error when there is an error to execute the query", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = staff.databaseConnection.readSingleTable;
    staff.databaseConnection.readSingleTable = mockFunc;

    const result = await staff.get_branch_id(user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    staff.databaseConnection.readSingleTable = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await staff.get_branch_id(user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("result");
  });
});
