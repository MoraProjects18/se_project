const customer = require("../../../src/controllers/customer");
const request = require("supertest");
const jwt = require("jsonwebtoken");
let server ;

describe("/customer", () => {

    const payload = {
        user_id : 5,
        first_name : "Hithru",
        last_name : "Alwis",
        user_type: "customer",
        email_verification:1
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
  
    describe("/cancelTicket ", () => {

        describe("/ POST", () => {
            it("should return 302 when redirection successfull when ticket_id is valid", async () => {
                const res = await request(server)
                    .post('/customer/cancelTicket')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({ticket_id : '4'})

                expect(res.status).toBe(302);
            });

            
        })

    })

   
  

    
})