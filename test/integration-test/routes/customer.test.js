const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
let server;

const Database = require("../../../src/database/database");
const database = new Database();

jest.setTimeout(60000);

describe("GET /customer/home", () => {
  const payload = {
    user_id: 3,
    first_name: "Pasindu",
    last_name: "Abeysinghe",
    user_type: "customer",
    email_verification: true,
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 400 error status code when the account is not verified", async () => {
    const data = {...payload};
    data.email_verification = false;
    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/customer/home")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the home page is succesfully retrieved", async () => {
    const res = await request(server)
      .get("/customer/home")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("GET /customer/register", () => {
  beforeEach(() => {
    server = require("../../../src/app");
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the register page is succesfully retrieved", async () => {
    const res = await request(server).get("/customer/register").send();

    expect(res.status).toBe(200);
  });
});

describe("POST /customer/register", () => {
  const data = {
    first_name: "Dilshan",
    last_name: "Senarath",
    email: "dilshan99news@gmail.com",
    password: "@Password1",
    NIC: "990041091V",
    license_number: "12345687",
    contact_no: "0727469834",
  };

  beforeEach(() => {
    server = require("../../../src/app");
  });

  const removeUser = async () => {
    const result = await database.readSingleTable("useracc", "user_id", [
      "email",
      "=",
      data.email,
    ]);

    userId = result.result[0].user_id;

    await database.delete("customer", ["user_id", "=", userId]);
    await database.delete("contact_no", ["user_id", "=", userId]);
    await database.delete("useracc", ["user_id", "=", userId]);
  };

  afterEach(() => {
    server.close();
  });

  it("give 400 status code when the provided data is invalid", async () => {
    const data = {};

    const res = await request(server).post("/customer/register").send(data);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the register is not completed", async () => {
    const temp = { ...data };
    temp.email = "pasindu@gmail.com";

    const res = await request(server).post("/customer/register").send(temp);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the registration is success", async () => {
    const res = await request(server).post("/customer/register").send(data);

    expect(res.status).toBe(302);

    await removeUser();
  });
});

describe("GET /customer/register/confirm/:email", () => {
  const userId = 3;
  const email = "pasindu@gmail.com";
  let encryptedId;

  beforeEach(async () => {
    server = require("../../../src/app");

    await database.update(
      "customer",
      ["email_verification", false],
      ["user_id", "=", userId]
    );

    const salt = await bcrypt.genSalt(10);
    encryptedId = await bcrypt.hash(
      `${userId}`,
      salt
    );
  });

  afterEach(async () => {
    server.close();

    await database.update(
      "customer",
      ["email_verification", true],
      ["user_id", "=", userId]
    );
  });

  it("give 400 status code when the provided email is invalid", async () => {
    const email = "worng-email";

    const res = await request(server).get(`/customer/register/confirm/${email}?id=${encryptedId}`).send();

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the provided email is not in the database", async () => {
    const email = "pasind@gmail.com";

    const res = await request(server).get(`/customer/register/confirm/${email}?id=${encryptedId}`).send();

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the account is already confirmed", async () => {
    const userId = 5;
    const salt = await bcrypt.genSalt(10);
    const encryptedId = await bcrypt.hash(
      `${userId}`,
      salt
    );
    const email = "hithru@gmail.com";

    const res = await request(server).get(`/customer/register/confirm/${email}?id=${encryptedId}`).send();

    expect(res.status).toBe(400);
  });

  it("give 406 status code when the encrypted user id is incorrect", async () => {
    const encryptedId = "wrong-encryption";

    const res = await request(server).get(`/customer/register/confirm/${email}?id=${encryptedId}`).send();

    expect(res.status).toBe(406);
  });

  it("give 200 OK status code when the confirmation is success", async () => {
    const res = await request(server).get(`/customer/register/confirm/${email}?id=${encryptedId}`).send();

    expect(res.status).toBe(302);
  });
});

describe("GET /customer/profile", () => {
  const payload = {
    user_id: 3,
    first_name: "Pasindu",
    last_name: "Abeysinghe",
    user_type: "customer",
    email_verification: true,
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 403 status code when the user type is not a customer", async () => {
    const data = {...payload};
    data.user_type = "not-customer";
    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/customer/profile")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(403);
  });

  it("give 500 status code when there is an error to get data", async () => {
    const data = {...payload};
    data.user_id = null;
    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/customer/profile")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(500);
  });

  it("give 400 status code when the user id is not valid", async () => {
    const data = {...payload};
    data.user_id = "wrong-id";
    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/customer/profile")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the prfile details is successfully retrieved", async () => {
    const res = await request(server)
      .get("/customer/profile")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("POST /customer/edit_profile",() => {
  const payload = {
    user_id:3,
    first_name:"Pasindu",
    last_name:"Abeysinghe",
    user_type:"customer",
    email_verification: true,
  }
  let token;
  const data = {
    first_name: "Abeysinghe",
    last_name: "Pasindu",
    contact_no: "0745896567",
  }

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(payload,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when the provided data is invalid", async () => {
    const data = {};

    const res = await request(server).post('/customer/edit_profile').set('Cookie',[`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when there is an error to update data in database", async () => {
    const load = {...payload};
    load.user_id = "wrong-id";
    const token = jwt.sign(load, config.get("jwtPrivateKey"));

    const res = await request(server)
      .post("/customer/edit_profile")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send(data);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the profile editing is success", async () => {
    const res = await request(server).post('/customer/edit_profile').set('Cookie',[`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(302);

    const preData = {
      first_name: "Pasindu",
      last_name: "Abeysinghe",
      contact_no: "0745896567",
    }
    await request(server).post('/customer/edit_profile').set('Cookie',[`ets-auth-token=${token}`]).send(preData);
  });
});

describe("POST /customer/change_pass",() => {
  const payload = {
    user_id:3,
    first_name:"Pasindu",
    last_name:"Abeysinghe",
    user_type:"customer",
    email_verification: true,
  }
  let token;
  const data = {
    new_password:"@Password2",
    current_password: "@Password1",
  }

  const restorePassword = async () => {
    const temp = {
      new_password: "@Password1",
      current_password: "@Password2",
    }
    await request(server).post('/customer/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);
  }

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(payload,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when the provided new password is invalid", async () => {
    const temp = {...data};
    temp.new_password = "";

    const res = await request(server).post('/customer/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the provided current password is invalid", async () => {
    const temp = {...data};
    temp.current_password = "wrong-password";

    const res = await request(server).post('/customer/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the password change is success", async () => {
    const res = await request(server).post('/customer/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(302);

    await restorePassword();
  });
});

describe("GET /customer/createTicket", () => {
  const payload = {
    user_id: 3,
    first_name: "Pasindu",
    last_name: "Abeysinghe",
    user_type: "customer",
    email_verification: true,
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the create ticket page is succesfully retrieved", async () => {
    const res = await request(server)
      .get("/customer/createTicket")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("GET /customer/ticketDetails", () => {
  const payload = {
    user_id: 3,
    first_name: "Pasindu",
    last_name: "Abeysinghe",
    user_type: "customer",
    email_verification: true,
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 400 status code when the user id is not valid", async () => {
    const data = {...payload};
    data.user_id = "wrong-id";
    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/customer/ticketDetails")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the ticket details is successfully retrieved", async () => {
    const res = await request(server)
      .get("/customer/ticketDetails")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("POST /customer/cancelTicket",() => {
  const payload = {
    user_id:3,
    first_name:"Pasindu",
    last_name:"Abeysinghe",
    user_type:"customer",
    email_verification: true,
  }
  let token;
  const data = {
    ticket_id: 1
  }

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(payload,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when the provided ticket id is invalid", async () => {
    const temp = {...data};
    temp.ticket_id = "wrong-id";

    const res = await request(server).post('/customer/cancelTicket').set('Cookie',[`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the ticket cancelation is success", async () => {
    const res = await request(server).post('/customer/cancelTicket').set('Cookie',[`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(302);
  });
});

describe("GET /customer/getmyso", () => {
  const payload = {
    user_id: 3,
    first_name: "Pasindu",
    last_name: "Abeysinghe",
    user_type: "customer",
    email_verification: true,
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the service order details are successfully retrieved", async () => {
    const res = await request(server)
      .get("/customer/getmyso")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code when the service order details are successfully retrieved", async () => {
    const data = {
      user_id: 5,
      first_name: "hithru",
      last_name: "Alwis",
      user_type: "customer",
      email_verification: true,
    }

    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/customer/getmyso")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});
