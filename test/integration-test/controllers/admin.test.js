const adminC = require("../../../src/controllers/admin");
const request = require("supertest");
const { iteratee } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Database = require("../../../src/database/database")
const database = new Database();
let server ;

jest.setTimeout(60000);

const removeUser = async (email) => {
    const result = await database.readSingleTable("useracc", "user_id", [
      "email",
      "=",
      email,
    ]);

    user_id = result.result[0].user_id;

    await database.delete("staff", ["user_id", "=", user_id]);
    await database.delete("contact_no", ["user_id", "=", user_id]);
    await database.delete("useracc", ["user_id", "=", user_id]);
  };

describe("/admin", () => {
    const payload = {
        user_id : 1,
        first_name : "Admin",
        last_name : "Super",
        user_type : "admin"
    }
    let token;

    beforeAll( (done) => {
        server = require('../../../src/app');
        token = jwt.sign(payload, "BRpGcRf_nLyj0");
        done();
    })

    beforeEach(() => {
        server = require('../../../src/app');
    })
    afterEach(() => {
        server.close();
    })

    it("should return 401 when token is not set", async () => {
        const res = await request(server).get('/admin/home')
        expect(res.status).toBe(401);
    });

    describe("/home GET", () => {
        it("should return 403 forbidden when token is not valid", async () => {
            const payload = {
                user_id : 7,
                first_name : "cashier1",
                last_name : "1cashier",
                user_type : "guest"
            }
            const token = jwt.sign(payload, "BRpGcRf_nLyj0");
            const res = await request(server)
                .get('/admin/home')
                .set("Cookie",[`ets-auth-token=${token}`] )
            expect(res.status).toBe(403);
        });

        it("should return 200 when token is set", async () => {
            const res = await request(server)
                                .get('/admin/home')
                                .set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(200);
        });
    })

    describe("/addStaff GET", () => {
        it("should return 200 when token is set", async () => {
            const res = await request(server)
                                .get('/admin/addStaff')
                                .set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(200);
        });
    })

    describe("/addStaff POST", () => {

        it("should return 400 validation error for invalid data", async () => {
            const data = {};

            const res = await request(server)
                                .post('/admin/addStaff')
                                .set("Cookie",[`ets-auth-token=${token}`] )
                                .send(data);


            expect(res.status).toBe(400);
          });

        it("should return error 400 when there is an error to execute the stored procedure", async () => {
            const data = {
                employee_id: "5000",
                first_name: "Test",
                last_name: "User",
                email: "admin1@gmail.com",
                password: "@Password1",
                NIC: "771234999V",
                user_type: "cashier",
                branch_id: "1",
                contact_no: "07457896999",
                };

        const res = await request(server)
                                .post('/admin/addStaff')
                                .set("Cookie",[`ets-auth-token=${token}`] )
                                .send(data);

        expect(res.status).toBe(400);
        });

        it("should return status 302 when success", async () => {
            const data = {
                employee_id: "2111",
                first_name: "Test",
                last_name: "User",
                email: "test1@gmail.com",
                password: "@Password1",
                NIC: "771234888V",
                user_type: "cashier",
                branch_id: "1",
                contact_no: "07457896888",
                };

        const res = await request(server)
                        .post('/admin/addStaff')
                        .set("Cookie",[`ets-auth-token=${token}`] )
                        .send(data);

        expect(res.status).toBe(302);
        await removeUser(data.email);
        });
    })



});
