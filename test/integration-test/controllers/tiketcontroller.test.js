const ticketController = require("../../../src/controllers/ticketController");
const request = require("supertest");
const Database = require("../../../src/database/database")
const db = new Database();
let server ;

describe("/ticket", () => {


    beforeAll( (done) => {
        server = require('../../../src/app');
    })
    beforeEach(() => {
        server = require('../../../src/app');
    })
    afterEach(() => {
        server.close();
    })
  

    describe("/confirmTicket ", () => {


        describe("/ GET", () => {

            it("should return 302 when redirection successfull when ticket_id is valid", async () => {
                   const data={ticket_id : '4'}
                    const res = await request(server)
                        .get(`/ticket/confirmTicket?ticket_id=${data.ticket_id}`)                     
                      
                        expect(res.status).toBe(302);
            });

                           
            })


    })

    

})