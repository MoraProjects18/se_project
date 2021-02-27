const reportIssuer = require("../../../src/controllers/emission_report");
const request = require("supertest");
const jwt = require("jsonwebtoken");
let server;


describe("/reportissuer", () => {
    const payload = {
        user_id : 9,
        first_name : "reportissuer1",
        last_name : "1reportissuert",
        user_type : "reportissuer"
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
        const res = await request(server).get('/reportissuer/report');
        expect(res.status).toBe(401);
    });

    describe("/home ", () => {
            it("should return 200 Token is set", async () => {
                const res = await request(server)
                    .get('/reportissuer/home')
                    .set("Cookie",[`ets-auth-token=${token}`] )

                expect(res.status).toBe(200);
            });
    });

    describe("/profile ", () => {
            it("should return 200 with Token is valid", async () => {
                const res = await request(server)
                    .get('/reportissuer/profile')
                    .set("Cookie",[`ets-auth-token=${token}`] )

                expect(res.status).toBe(200);
            });
    });

    describe("/report" ,() => {
            it("should return 200 when logged in Report Issuer", async () => {
                const res = await request(server)
                    .get('/reportissuer/report')
                    .set("Cookie",[`ets-auth-token=${token}`] )

                expect(res.status).toBe(200);
            });
    });

    describe("/get_report/:id/html" ,() => {
        it("should return 200 for successful Html report", async () => {
            const SO_id=1001;
            const res = await request(server)
                .get('/reportissuer/get_report/'+SO_id+'/html')
                .set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(200);
        });

        it("should return 400 For Invalid Service Order ID", async () => {
            const SO_id=1000;
            const res = await request(server)
                .get('/reportissuer/get_report/'+SO_id+'/html')
                .set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(400);
        });

        it("should return 422 For Service Order ID with incomplete test", async () => {
            const SO_id=1003;
            const res = await request(server)
                .get('/reportissuer/get_report/'+SO_id+'/html')
                .set("Cookie",[`ets-auth-token=${token}`] )

            expect(res.status).toBe(422);
        });
    });


    describe("/get_report/:id/pdf" ,() => {
        jest.setTimeout(15000);
        it("should return 200 for successful PDF report", async () => {
            const SO_id=1001;
            const res = await request(server)
                .get('/reportissuer/get_report/'+SO_id+'/pdf')
                .set("Cookie",[`ets-auth-token=${token}`] )
            expect(res.status).toBe(200);
        });

        it("should return 422 For Service Order ID with incomplete test", async () => {
            const SO_id=1003;
            const res = await request(server)
                .get('/reportissuer/get_report/'+SO_id+'/pdf')
                .set("Cookie",[`ets-auth-token=${token}`] )
            
            expect(res.status).toBe(422);
        });
    });

    
    
    describe("/view_final_report" ,() => {
        it("should return 302 when redirection successfull", async () => {
            const res = await request(server)
                .post('/reportissuer/view_final_report')
                .set("Cookie",[`ets-auth-token=${token}`] )
                .send({SO_id : 1001})

            expect(res.status).toBe(302);

        });
    });

    describe("/get_final_report" ,() => {
        it("should return 302 when redirection successfull", async () => {
            const res = await request(server)
                .post('/reportissuer/get_final_report')
                .set("Cookie",[`ets-auth-token=${token}`] )
                .send({SO_id : 100})

            expect(res.status).toBe(302);

        });
    });

});