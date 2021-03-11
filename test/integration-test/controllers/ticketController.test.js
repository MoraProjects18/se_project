
const ticketC = require("../../../src/controllers/ticketController");
const request = require("supertest");
const { iteratee } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Database = require("../../../src/database/database")
const db = new Database();
let server ;

jest.setTimeout(60000);

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

            it("should return 302 when redirection successfull", async () => {
                let ticket_id = 1013;
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
                        user_id : 3,
                        status : "Open",
                        branch_id: 1,
                        start_date: '2021-04-14',
                        start_time:"01:30"
                    })

                expect(res.status).toBe(302);
            });


            it("should return 401 when create ticket call without user token set", async () => {
                const res = await request(server)
                    .post("/ticket/create" )
                    .send({
                        user_id : 2,
                        status : "Open",
                        branch_id: 1,
                        start_date: Date.parse('2017-02-14'),
                        start_time:"01:30"
                    })

                expect(res.status).toBe(401);
            });

        })
    })

    describe("/todayTicketData ", () => {
        describe("/ GET", () => {
            jest.setTimeout(15000);
            const payload = {
                user_id: 8,
                first_name: "receptionist1",
                last_name: "1receptionist",
                user_type: "receptionist",
              };
              let token;
              const data = {
                NIC: "972654889V"
              }

              beforeEach(() => {
                server = require("../../../src/app");

                token = jwt.sign(payload, config.get("jwtPrivateKey"));
              });

              afterEach(() => {
                server.close();
              });
            it("should return 401 when staff token is not set", async () => {
                const res = await request(server)
                    .get("/receptionist/ticket/todayTicketData")


                expect(res.status).toBe(401);
            });

            it("should return 200 when staff token is not set", async () => {
                const res = await request(server)
                    .get("/receptionist/ticket/todayTicketData").set("Cookie", [`ets-auth-token=${token}`])


                expect(res.status).toBe(200);
            });
        })
    })

    describe("/todayTicket ", () => {
        describe("/ GET", () => {
            const payload = {
                user_id: 8,
                first_name: "receptionist1",
                last_name: "1receptionist",
                user_type: "receptionist",
              };
              let token;
              const data = {
                NIC: "972654889V"
              }

              beforeEach(() => {
                server = require("../../../src/app");

                token = jwt.sign(payload, config.get("jwtPrivateKey"));
              });

              afterEach(() => {
                server.close();
              });


            it("should return 401 when staff token is not set", async () => {
                const res = await request(server)
                    .get("/receptionist/ticket/todayTicket")


                expect(res.status).toBe(401);
            });


            it("should return 200 when staff token is not set", async () => {
                const res = await request(server)
                    .get("/receptionist/ticket/todayTicket").set("Cookie", [`ets-auth-token=${token}`])


                expect(res.status).toBe(200);
            });
        })
    })

    // describe("/createTicket ", () => {
    //     describe("/ GET", () => {

    //         it("should return 401 when customer token is not set", async () => {
    //             const res = await request(server)
    //                 .get("/customer//createTicket")


    //             expect(res.status).toBe(401);
    //         });
    //     })
    // })


    // describe("/createTicket ", () => {
    //     describe("/ GET", () => {

    //         it("should return 401 when customer token is not set", async () => {
    //             const res = await request(server)
    //                 .get("/customer/createTicket")


    //             expect(res.status).toBe(401);
    //         });
    //     })
    // })


    // describe("/cancelTicket ", () => {
    //     describe("/ POST", () => {

    //         it("should return 401 when customer token is not set", async () => {
    //             const res = await request(server)
    //                 .post("/customer/cancelTicket")


    //             expect(res.status).toBe(401);
    //         });
    //     })
    // })

    // describe("/ticketDetails ", () => {
    //     describe("/ GET", () => {

    //         it("should return 401 when customer token is not set", async () => {
    //             const res = await request(server)
    //                 .get("/customer/ticketDetails")


    //             expect(res.status).toBe(401);
    //         });
    //     })
    // })








})
