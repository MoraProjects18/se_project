const Ticket = require("../../../src/models/ticket");
const Database= require("../../../src/database/database");
const ticket = new Ticket();
const database = new Database();

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