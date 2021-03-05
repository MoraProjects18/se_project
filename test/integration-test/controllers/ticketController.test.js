  
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


    describe("/ConfirmTicket ", () => {
        describe("/ GET", () => {
            const ticket_id = 1013;
            it("should return 302 when redirection successfull", async () => {
                const res = await request(server)
                    .get('/ticket/confirmTicket?ticket_id='+ticket_id)
                    

                expect(res.status).toBe(302);
            });
        })
    })

    describe("/getTimeSlots ", () => {
        describe("/ GET", () => {
            const branch_id = 2;
            const start_date = "2021-03-15";
            it("should return 200 with when valid branch_id and start_date", async () => {
                const res = await request(server)
                    .get("/ticket/gettimeslot?branch_id="+branch_id+"&start_date="+start_date)
                    

                expect(res.status).toBe(200);
            });
        })
    })


    describe("/create ", () => {
        describe("/ POST", () => {

            it("should return 302 when create ticket and redirection successfull", async () => {
                const res = await request(server)
                    .post("/ticket/create" )
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({
                        user_id : 2,
                        status : "Open",
                        branch_id: 1,
                        start_date: Date.parse('2017-02-14'),
                        start_time:"01:30"
                    })

                expect(res.status).toBe(302);
            });
        })
    })



    
})