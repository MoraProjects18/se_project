const guestC = require("../../../src/controllers/guest");
const request = require("supertest");
const { iteratee } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Database = require("../../../src/database/database")
const db = new Database();
let server ;

jest.setTimeout(60000);

describe("/guest", () => {

    const payload = {
        user_type : "guest"
    }
    let token;

    beforeEach(() => {
        server = require('../../../src/app');
        token = jwt.sign(payload, "BRpGcRf_nLyj0");
    })
    afterEach(() => {
        server.close();
    })


    describe("/home ", () => {
        it("should return 200", async () => {
            const res = await request(server)
                .get('/home/')

            expect(res.status).toBe(200);
        });

        it("should return redirection status 302", async () => {
            const res = await request(server)
                .get('/home/').set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(302);
        });

        it("should return 400 when the token is not valid", async () => {
            const token = "wrong-token";

            const res = await request(server)
                .get('/home/').set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(400);
        });
    })

})
