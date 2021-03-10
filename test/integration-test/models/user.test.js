const User = require("../../../src/models/user");
const user = new User();

describe("login", () => {
  let data;
  let originalFunc;

  beforeEach(async () => {
    data = {
      email: "pasindu@gmail.com",
      password: "@Password1",
    };
  });

  it("should return validation error when the inputs are incorrect", async () => {
    let cred = { ...data };
    cred.email = "pasindu";

    const result = await user.login(cred);

    expect(result).toHaveProperty("validationError");
  });

  it("should return access denied error when the email is incorrect", async () => {
    let cred = { ...data };
    cred.email = "pasind@gmail.com";

    const result = await user.login(cred);

    expect(result).toHaveProperty("allowAccess", false);
  });

  it("should return access denied error when the password is incorrect", async () => {
    let cred = { ...data };
    cred.password = "tgds";

    const result = await user.login(cred);

    expect(result).toHaveProperty("allowAccess", false);
  });

  it("should return success data object with email verification when the customer logged in to the site", async () => {
    const result = await user.login(data);

    expect(result).toHaveProperty("allowAccess", true);
    expect(result).toHaveProperty("tokenData");
    expect(result.tokenData).toHaveProperty("user_id");
    expect(result.tokenData).toHaveProperty("first_name");
    expect(result.tokenData).toHaveProperty("last_name");
    expect(result.tokenData).toHaveProperty("user_type");
    expect(result.tokenData).toHaveProperty("email_verification");
  });

  it("should return success data object without email verification when the non-customer user logged in to the site", async () => {
    const temp = { ...data };
    temp.email = "admin1@gmail.com";
    temp.password = "@Password1";
    const result = await user.login(temp);

    expect(result).toHaveProperty("allowAccess", true);
    expect(result).toHaveProperty("tokenData");
    expect(result.tokenData).toHaveProperty("user_id");
    expect(result.tokenData).toHaveProperty("first_name");
    expect(result.tokenData).toHaveProperty("last_name");
    expect(result.tokenData).toHaveProperty("user_type");
  });
});
