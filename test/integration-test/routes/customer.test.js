const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
let server;

const Database = require("../../../src/database/database");
const database = new Database();

describe("GET /customer/home",() => {
  const payload = {
    user_id:3,
    first_name:"Pasindu",
    last_name:"Abeysinghe",
    user_type:"customer",
    email_verification: true,
  }
  let token;

  beforeEach(()=>{
    server = require("../../../src/app")

    token = jwt.sign(payload,config.get("jwtPrivateKey"));
  })

  afterEach(()=> {
    server.close();
  })

  it("give 200 OK status code when the home page is succesfully retrieved", async () => {
    const res = await request(server).get('/customer/home').set('Cookie',[`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(200);
  });
});

describe("GET /customer/register",() => {
  beforeEach(()=>{
    server = require("../../../src/app")
  })

  afterEach(()=> {
    server.close();
  })

  it("give 200 OK status code when the register page is succesfully retrieved", async () => {
    const res = await request(server).get('/customer/register').send();

    expect(res.status).toBe(200);
  });
});

describe("POST /customer/register",() => {
  const data = {
      first_name: "Dilshan",
      last_name: "Senarath",
      email: "dilshan@gmail.com",
      password: "@Password1",
      NIC: "990041091V",
      license_number: "123456B7",
      contact_no: "0727469834",
    };

  beforeEach(()=>{
    server = require("../../../src/app")
  })

  const removeUser = async() => {
    const result = await database.readSingleTable("useracc", "user_id", [
      "email",
      "=",
      data.email,
    ]);

    userId = result.result[0].user_id;

    await database.delete("customer", [
      "user_id",
      "=",
      userId,
    ]);
    await database.delete("contact_no", [
      "user_id",
      "=",
      userId,
    ]);
    await database.delete("useracc", ["user_id", "=", userId]);
  }

  afterEach(()=> {
    server.close();
  })

  it("give 400 status code when the provided data is invalid", async () => {
    const data = {};

    const res = await request(server).post('/customer/register').send(data);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the register is not completed", async () => {
    const temp = {...data};
    temp.email = "pasindu@gmail.com";

    const res = await request(server).post('/customer/register').send(temp);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the registration is success", async () => {
    const res = await request(server).post('/customer/register').send(data);

    expect(res.status).toBe(302);

    await removeUser();
  });
});

// describe("GET /customer/confirm/:email",() => {
//   const data = {
//       first_name: "Dilshan",
//       last_name: "Senarath",
//       email: "dilshan@gmail.com",
//       password: "@Password1",
//       NIC: "990041091V",
//       license_number: "123456B7",
//       contact_no: "0727469834",
//     };
//
//   beforeEach(async ()=>{
//     server = require("../../../src/app")
//
//     await request(server).post('/customer/register').send(data);
//   })
//
//   const removeUser = async() => {
//     const result = await database.readSingleTable("useracc", "user_id", [
//       "email",
//       "=",
//       data.email,
//     ]);
//
//     userId = result.result[0].user_id;
//
//     await database.delete("customer", [
//       "user_id",
//       "=",
//       userId,
//     ]);
//     await database.delete("contact_no", [
//       "user_id",
//       "=",
//       userId,
//     ]);
//     await database.delete("useracc", ["user_id", "=", userId]);
//   }
//
//   afterEach(async()=> {
//     server.close();
//
//     await removeUser();
//   })
//
//   it("give 400 status code when the provided data is invalid", async () => {
//     const data = {};
//
//     const res = await request(server).post('/customer/register').send(data);
//
//     expect(res.status).toBe(400);
//   });
//
//   it("give 400 status code when the register is not completed", async () => {
//     const temp = {...data};
//     temp.email = "pasindu@gmail.com";
//
//     const res = await request(server).post('/customer/register').send(temp);
//
//     expect(res.status).toBe(400);
//   });
//
//   it("give 200 OK status code when the registration is success", async () => {
//     const res = await request(server).post('/customer/register').send(data);
//
//     expect(res.status).toBe(302);
//
//     await removeUser();
//   });
// });


// describe("GET /customer/getmyso",() => {
//   const payload = {
//     user_id:3,
//     first_name:"Pasindu",
//     last_name:"Abeysinghe",
//     user_type:"customer",
//     email_verification: true,
//   }
//   let token;
//
//   beforeEach(()=>{
//     server = require("../../../src/app")
//
//     token = jwt.sign(payload,config.get("jwtPrivateKey"));
//   })
//
//   afterEach(()=> {
//     server.close();
//   })
//
//   it("give 400 status code when the provided password is invalid", async () => {
//     const temp = {...data};
//     temp.new_password = "";
//
//     const res = await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);
//
//     expect(res.status).toBe(400);
//   });
//
//   it("give 400 status code when the provided password is invalid", async () => {
//     const temp = {...data};
//     temp.current_password = "wrong-password";
//
//     const res = await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(temp);
//
//     expect(res.status).toBe(400);
//   });
//
//   it("give 200 OK status code when the password change is success", async () => {
//     const res = await request(server).post('/staff/change_pass').set('Cookie',[`ets-auth-token=${token}`]).send(data);
//
//     expect(res.status).toBe(302);
//
//     restorePassword();
//   });
// });
