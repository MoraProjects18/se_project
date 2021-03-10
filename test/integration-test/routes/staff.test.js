const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
let server;

jest.setTimeout(60000);

describe("GET /staff/profile",() => {
  const data = {
    user_id:7,
    first_name:"Dilshan",
    last_name:"Senarath",
    user_type:"cashier",
  }
  let token;

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(data,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 500 status code when there is a internal error", async () => {
    const temp = {...data};
    temp.user_id = null;

    const token = jwt.sign(temp,config.get("jwtPrivateKey"));

    const res = await request(server).get('/staff/profile').set('Cookie',[`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(500);
  });

  it("give 400 status code when there is an error to retrieve data from database", async () => {
    const temp = {...data};
    temp.user_id = "a";

    const token = jwt.sign(temp,config.get("jwtPrivateKey"));

    const res = await request(server).get('/staff/profile').set('Cookie',[`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the logout is succesful", async () => {
    const res = await request(server).get('/staff/profile').set('Cookie',[`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(200);
  });
});

describe("POST /staff/edit_profile",() => {
  const payload = {
    user_id:7,
    first_name:"Dilshan",
    last_name:"Senarath",
    user_type:"cashier",
  }
  const data = {
    first_name: "Udara",
    last_name: "Senarath",
    contact_no: "0727469834",
  }
  let token;

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(payload,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when the provided data is invalid", async () => {
    const temp = {...data};
    temp.first_name = "";

    const res = await request(server).post('/staff/edit_profile').set('Cookie',[`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });


  it("give 200 OK status code when the profile edit is succesful", async () => {
    const res = await request(server).post('/staff/edit_profile').set('Cookie',[`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(302);
  });
});

describe("POST /staff/change_pass",() => {
  const payload = {
    user_id:7,
    first_name:"Dilshan",
    last_name:"Senarath",
    user_type:"cashier",
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
    await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);
  }

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(payload,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when the provided password is invalid", async () => {
    const temp = {...data};
    temp.new_password = "";

    const res = await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the provided password is invalid", async () => {
    const temp = {...data};
    temp.current_password = "wrong-password";

    const res = await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the password change is success", async () => {
    const res = await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(302);

    await restorePassword();
  });
});
