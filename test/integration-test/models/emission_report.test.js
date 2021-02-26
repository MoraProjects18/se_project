const EmissionReport = require("../../../src/models/report");
const Database= require("../../../src/database/database");
const emissionreport = new EmissionReport();
const database = new Database();

describe("Get SO details", () => {
    it("should return Service Order Data when success", async () => {
        const result = await emissionreport.get_SO_details();
        expect(result).toHaveProperty("result");
      });
});


describe("update SO State", () => {
    it("should return Error When SO ID does not exist", async () => {
        const result = await emissionreport.update_so_state(1000,"Closed");
        expect(result).toMatchObject({error: true});
    });

    it("should return Error when SO_id and state not provided", async () => {
        const result = await emissionreport.update_so_state();
        expect(result).toMatchObject({error: true});
    });

    it("should return Success when SO ID exist and updated", async () => {
        const So_id=1003;
        const result = await emissionreport.update_so_state(So_id,"Closed");
        expect(result).toHaveProperty("result");
        await database .update(
            "service_order",
            ["status", "Paid"],
            ["service_order_id", "=", So_id]
            );
    });   
});


describe("Get Service Order", () => {
    it("should return Service Order when success", async () => {
        const result = await emissionreport.get_SO(1003);
        expect(result).toHaveProperty("result");
      });

      it("should return Error when SO does not exist", async () => {
        const result = await emissionreport.get_SO(1009);
        expect(result).toMatchObject({error: true});
      });

      it("should return Error when SO not given", async () => {
        const result = await emissionreport.get_SO();
        expect(result).toMatchObject({error: true});
      });
});


describe("Get Test Results", () => {
    it("should return Test Results when Success", async () => {
        const SO_id=1001;
        const result = await emissionreport.get_test(SO_id);
       // console.log(result);
        expect(result).toHaveProperty("center");
        expect(result).toMatchObject({service_order_id: SO_id});
        expect(result).toHaveProperty("test_No");
        expect(result).toHaveProperty("certificate_NO");
        expect(result).toHaveProperty("test_status");
        expect(result).toHaveProperty("inspector_id");
    });

    it("should return Empty List when test is not completed", async () => {
        const SO_id=1003;
        const result = await emissionreport.get_test(SO_id);
        expect(result).toEqual([]);  
      });

    it("should return error when an error occured in API url", async () => {
        const result = await emissionreport.get_test();
        expect(result).toMatchObject({ error: "Not Connected"});
      });
});


describe("Get PDF file", () => {
    jest.setTimeout(10000);
    it("should return PDF", async () => {
        const result = await emissionreport.get_report_pdf();
        expect(result).toEqual(expect.anything());
      });
});