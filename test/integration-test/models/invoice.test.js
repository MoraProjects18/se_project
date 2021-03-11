const Invoice = require("../../../src/models/invoice");
const Database= require("../../../src/database/database");

const db = new Database();

jest.setTimeout(60000);


describe("Invoice Model", () => {
    const invoice = new Invoice();

    describe("create invoice", () => {
        it("When successfuly inserted should return error false " , async () => {
            const data = {
                service_order_id : 1002,
                payment_amount : 850,
            }

            const res = await invoice.createInvoice(data);
            expect(res).toHaveProperty("error", false);
            await db.delete("invoice",["invoice_id","=",data.invoice_id])
        })

        it("When data is missing should return error" , async () => {
            const data = {
                service_order_id: 1001,
            }

            const res = await invoice.createInvoice(data);
            expect(res).toHaveProperty("validationError", expect.anything());
        })

        it("When service order is invalid should return error" , async () => {
            const data = {
                service_order_id: 1500,
                payment_amount : 850,
            }

            const res = await invoice.createInvoice(data);
            expect(res).toHaveProperty("error", true);
        })
    })


    describe("get invoice", () => {
        it("When correct invoice_id is inserted should return invoice " , async () => {
            const data = {
                invoice_id: 1001,
            }

            const res = await invoice.getInvoice(data);
            expect(res).toHaveProperty("error", false);
            expect(res.result[0]).toHaveProperty("invoice_id", data.invoice_id);
        })

        it("When invoice_id is invalid should return error" , async () => {
            const data = {
                invoice_id: "sdfsd",
            }

            const res = await invoice.getInvoice(data);
            expect(res).toHaveProperty("validationError", expect.anything());
        })

        it("When invoice_id is not in database should return empty array" , async () => {
            const data = {
                invoice_id: 1050000,
            }

            const res = await invoice.getInvoice(data);
            expect(res.result).toHaveLength(0);
        })
    })

    describe("get invoice by service order", () => {
        it("When correct service_order_id is inserted should return invoice " , async () => {
            const data = {
                service_order_id: 1001,
            }

            const res = await invoice.getInvoiceByServiceOrder(data);
            expect(res).toHaveProperty("error", false);
            expect(res.result[0]).toHaveProperty("invoice_id", data.service_order_id);
        })

        it("When service_order_id is invalid should return error" , async () => {
            const data = {
                service_order_id: "sdfsd",
            }

            const res = await invoice.getInvoiceByServiceOrder(data);
            expect(res).toHaveProperty("validationError", expect.anything());
        })

        it("When service_order_id is not in database should return empty array as result" , async () => {
            const data = {
                service_order_id: 1050000,
            }
            const res = await invoice.getInvoiceByServiceOrder(data);
            expect(res.result).toHaveLength(0);
        })
    });

    describe("get service order users", () => {

        it("When correct service_order_id is inserted should return service order and user " , async () => {

            service_order_id = 1001;
            const res = await invoice.getSOUser(service_order_id);
            expect(res).toHaveProperty("error", false);
            expect(res.result[0]).toHaveProperty("service_order_id", service_order_id);
        })

        it("When service_order_id is invalid should return error" , async () => {
            service_order_id = "sdfasf";
            const res = await invoice.getSOUser(service_order_id);
            expect(res).toHaveProperty("validationError", expect.anything());
        })

        it("When service_order_id is not in database shoud return error as result" , async () => {
            service_order_id = 1050000;
            const res = await invoice.getSOUser(service_order_id);
            expect(res.result).toHaveLength(0);
        })
    })
})
