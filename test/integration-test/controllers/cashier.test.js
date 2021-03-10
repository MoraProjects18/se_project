const cashierC = require("../../../src/controllers/cashier");
const request = require("supertest");
const { iteratee } = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const Database = require("../../../src/database/database")
const db = new Database();
let server ;

jest.setTimeout(60000);

describe("/cashier", () => {
    const payload = {
        user_id : 7,
        first_name : "cashier1",
        last_name : "1cashier",
        user_type : "cashier"
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
        const res = await request(server).get('/cashier/invoice')
        expect(res.status).toBe(401);
    });
    describe("/home ", () => {
        describe("/ GET", () => {
            it("should return 200 Token is set", async () => {
                const res = await request(server)
                    .get('/cashier/home')
                    .set("Cookie",[`ets-auth-token=${token}`] )

                expect(res.status).toBe(200);
            });
        })
    })

    describe("/profile ", () => {
        describe("/ GET", () => {
            it("should return 200 with Token is valid", async () => {
                const res = await request(server)
                    .get('/cashier/profile')
                    .set("Cookie",[`ets-auth-token=${token}`] )

                expect(res.status).toBe(200);
            });
        })
    })

    describe("/invoice" ,() => {
        describe("/get" ,() => {


            it("should return 200 when logged in as cashier", async () => {
                const res = await request(server)
                    .get('/cashier/invoice')
                    .set("Cookie",[`ets-auth-token=${token}`] )

                expect(res.status).toBe(200);
            });
        })

        describe("/post" ,() => {
            it("should return 200 when invoice_id is valid", async () => {
                const res = await request(server)
                    .post('/cashier/invoice')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({invoice_id : 1001})

                expect(res.status).toBe(200);

            });

            it("should return 400 invalid request when invoice_id is invalid", async () => {
                const res = await request(server)
                    .post('/cashier/invoice')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({invoice_id : "avsb"})

                expect(res.status).toBe(400);
            });

            it("should return 400 when service order is not found for given invoice_id", async () => {
                const res = await request(server)
                    .post('/cashier/invoice')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({invoice_id : "5000"})

                expect(res.status).toBe(400);
            });

        })

        // describe("Crete invoie" ,() => {
        //     it("should return 200 when invoice_id is valid", async () => {
        //         const data = {
        //             service_order_id : 1002,
        //             payment_amount : 850,
        //         }
        //         const res = await request(server)
        //             .post('/cashier/invoice')
        //             .set("Cookie",[`ets-auth-token=${token}`] )
        //             .send({invoice_id : 1001})

        //         expect(res.status).toBe(200);

        //     });

        //     it("should return 400 invalid request when invoice_id is invalid", async () => {
        //         const res = await request(server)
        //             .post('/cashier/invoice')
        //             .set("Cookie",[`ets-auth-token=${token}`] )
        //             .send({invoice_id : "avsb"})

        //         expect(res.status).toBe(400);
        //     });

        //     it("should return 400 when service order is not found for given invoice_id", async () => {
        //         const res = await request(server)
        //             .post('/cashier/invoice')
        //             .set("Cookie",[`ets-auth-token=${token}`] )
        //             .send({invoice_id : "5000"})

        //         expect(res.status).toBe(400);
        //     });

        // })

        describe("/pay POST", () => {
            it("should return 200 when service_order_id is valid", async () => {
                const res = await request(server)
                    .post('/cashier/invoice/pay')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : 1001})

                expect(res.status).toBe(200);

                db.update("service_order",
                    ["status", "Open"],
                    ["service_order_id", "=", data.service_order_id])
            });

            it("should return 400 invalid request when service_order_id is invalid", async () => {
                const res = await request(server)
                    .post('/cashier/invoice/pay')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : "avsb"})

                expect(res.status).toBe(400);
            });
        })

        describe("/close POST", () => {
            it("should return 200 when service_order_id is valid", async () => {
                const res = await request(server)
                    .post('/cashier/invoice/close')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : 1001})

                expect(res.status).toBe(200);

                db.update("service_order",
                    ["status", "Open"],
                    ["service_order_id", "=", data.service_order_id])
            });

            it("should return 400 invalid request when service_order_id is invalid", async () => {
                const res = await request(server)
                    .post('/cashier/invoice/close')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : "avsb"})

                expect(res.status).toBe(400);
            });
        })


    })

    describe("/searchInvoiceBySO ", () => {
        describe("/ POST", () => {
            it("should return 200 when service_order_id is valid", async () => {
                const res = await request(server)
                    .post('/cashier/searchInvoiceBySO')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : 1001})

                expect(res.status).toBe(200);
            });

            it("should return 400 invalid request when service_order_id is invalid", async () => {
                const res = await request(server)
                    .post('/cashier/searchInvoiceBySO')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : "avsb"})

                expect(res.status).toBe(400);
            });

            it("should return 404 when invoice is not found for given service_order_id", async () => {
                const res = await request(server)
                    .post('/cashier/searchInvoiceBySO')
                    .set("Cookie",[`ets-auth-token=${token}`] )
                    .send({service_order_id : 8000})

                expect(res.status).toBe(400);
            });
        })
    })



})
