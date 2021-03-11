const Database= require("../../../src/database/database");
const Ticket = require("../../../src/models/ticket");

jest.setTimeout(60000);

const db = new Database();
const ticket = new Ticket();
const database = new Database();

describe("Ticket Model", () => {
    const ticket = new Ticket();
    describe("create ticket", () => {
        it("When successfuly inserted should return error false " , async () => {

            const data = {
                user_id : 2,
                status : "Open",
                branch_id: 1,
                start_date: '2021-10-14',
                start_time:"01:30"
            }

            const res = await ticket.Initiate(data);
            expect(res).toHaveProperty("error", false);
            await db.delete("ticket",["ticket_id","=",data.ticket_id])
        })

        it("When data is missing should return error" , async () => {
            const data = {
                user_id : 2,
                status : "Open",
                branch_id: 1,

            }

            const res = await ticket.Initiate(data);
            expect(res).toHaveProperty("validationError", expect.anything());
        })

        it("When branch_id is invalid should return error" , async () => {

            const data = {
                user_id : 15,
                status : "Open",
                branch_id: 5,
                start_date: Date.parse('2017-02-14'),
                start_time:"01:30"
            }

            const res = await ticket.Initiate(data);
            expect(res).toHaveProperty("error", true);
        })

        it("When branch_id is invalid should return error" , async () => {

            let data = {
                user_id : 2,
                status : "Open",
                branch_id: 5,
                start_date: Date.parse('2017-02-14'),
                start_time:"01:30"
            }

            const res = await ticket.Initiate(data);
            expect(res).toHaveProperty("error", true);
        })
    })


    describe("GET Branch", () => {
        it("When There is no connection errors should return error false " , async () => {

            const res = await ticket.GetBranch();
            expect(res).toHaveProperty("error", false);

        })

    })


    describe("GET Times", () => {
        it("When Branch ID and Start Date is valid should return error false " , async () => {
            const branch_id = 2;
            const start_date = "2021-03-30";

            const res = await ticket.GetTime(branch_id, start_date);
            expect(res).toHaveProperty("error", false);

        })

    })


    describe("Close", () => {
        it("When Ticket ID is valid should return error false " , async () => {
            let ticket_id = 1011;


            const res = await ticket.Close(ticket_id);
            expect(res).toHaveProperty("error", false);

        })


    })


    describe("User Ticket", () => {
        it("When User ID is valid should return error false " , async () => {
            let user_id = 2;
            const res = await ticket.UserTicket(user_id);
            expect(res).toHaveProperty("error", false);
            expect(res).toHaveProperty("connectionError", false);
            expect(res).toHaveProperty("resultData");

        })



    })


    describe("Branch Ticket", () => {
        it("When Branch ID is valid should return error false " , async () => {
            const branch_id = 2;
            const res = await ticket.TodayTicket(branch_id);
            expect(res).toHaveProperty("error", false);

        })

    })
})

describe("close ticket", () => {

  it("should return validation error for invalid data", async () => {
    const data = '';

    const result = await ticket.Close(data);

    expect(result).toHaveProperty("error");
  });


  it("should return error false object with when success", async () => {
      const data = '4' ;

      const result = await ticket.Close(data);

      expect(result.error).toBe(false);
      expect(result.connectionError).toBe(false);

    await database.update("ticket", ["status", "Open"], ["ticket_id", "=", data]);


  });


});
