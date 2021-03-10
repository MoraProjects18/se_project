const guestC = require("../../../src/controllers/guest");
const request = require("supertest");
const { iteratee } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Database = require("../../../src/database/database")
const db = new Database();
let server ;

describe("/guest", () => {

    beforeEach(() => {
        server = require('../../../src/app');
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


    })
    
})
