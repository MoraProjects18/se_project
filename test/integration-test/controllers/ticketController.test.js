  
const ticketC = require("../../../src/controllers/ticketController");
const request = require("supertest");
const { iteratee } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Database = require("../../../src/database/database")
const db = new Database();
let server ;

describe("/ticket", () => {
    const payload = {
        user_id : 2,
        first_name : "Charuka",
        last_name : "Rathnayaka",
        user_type : "customer"
    }
    let token;

    beforeAll( (done) => {
        server = require('../../../src/app');
        token = jwt.sign(payload, "BRpGcRf_nLyj0");
        done();
    });
    beforeEach(() => {
        server = require('../../../src/app');
    });
    afterEach(() => {
        server.close();
    });
  
    it("should return 401 when token is not set", async () => {
        const res = await request(server).post('/ticket/create')
        expect(res.status).toBe(401);
    });



    
})