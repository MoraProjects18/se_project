const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
let server;

jest.setTimeout(60000);

describe("POST /auth/login",() => {
  const data = {
    email:"pasindu@gmail.com",
    password: "@Password1",
  }

  beforeEach(()=>{
    server = require("../../../src/app")
  })

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when there is a validation error of input data", async () => {
    const data = {};

    const res = await request(server).post('/auth/login').send(data);

    expect(res.status).toBe(400);
  });

  it("give 401 status code when the password is incorrect", async () => {
    const temp = {...data};
    temp.password = "aasdfd";

    const res = await request(server).post('/auth/login').send(temp);

    expect(res.status).toBe(401);
  });

  it("give 302 status code when the login is succesful", async () => {
    const res = await request(server).post('/auth/login').send(data);

    expect(res.status).toBe(302);
  });
});

describe("GET /auth/logout",() => {
  const data = {
    user_id:3,
    first_name:"Pasindu",
    last_name:"Abeysinghe",
    user_type:"customer",
    email_verification: true,
  }
  let token;

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(data,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 401 status code when there is no authorize token", async () => {
    const res = await request(server).get('/auth/logout').send();

    expect(res.status).toBe(401);
  });

  it("give 400 status code when the authorize token is incorrect", async () => {
    const token = "dsds";

    const res = await request(server).get('/auth/logout').set('Cookie',[`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(400);
  });

  it("give 302 status code when the logout is succesful", async () => {
    const res = await request(server).get('/auth/logout').set('Cookie',[`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(302);
  });
});

describe("GET /auth/login",() => {
  beforeEach(()=>{
    server = require("../../../src/app")
  })

  afterEach(()=> {
    server.close();
  })

  it("give 200 OK status code when the receive of login page is succesful", async () => {
    const res = await request(server).get('/auth/login').send();

    expect(res.status).toBe(200);
  });
});
