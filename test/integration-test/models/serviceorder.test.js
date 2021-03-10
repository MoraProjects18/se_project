const Database = require("../../../src/database/database");
const database = new Database();
const ServiceOrder = require("../../../src/models/serviceorder");
const serviceOrder = new ServiceOrder();

describe("Initiate", () => {
  let data = {
    user_id: 3,
    vehicle_number: "GH7895",
    start_date: "2022-03-09 17:31:46",
    end_date: "2022-03-09 18:41:46",
    payment_amount: 400,
  }

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await serviceOrder.Initiate(data);

    expect(result).toHaveProperty("validationError");
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.Initiate(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("data");
  });
});

describe("GetById", () => {
  let data = {
    service_order_id: 1006,
  }
  let originalFunc;

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await serviceOrder.GetById(data);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the query", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.readMultipleTable;
    serviceOrder.databaseConnection.readMultipleTable = mockFunc;

    const result = await serviceOrder.GetById(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.readMultipleTable = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.GetById(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("resultData");
  });
});

describe("Close", () => {
  let data = {
    service_order_id: 1006,
  }
  let originalFunc;

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await serviceOrder.Close(data);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the query", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.update;
    serviceOrder.databaseConnection.update = mockFunc;

    const result = await serviceOrder.Close(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.update = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.Close(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
  });
});

describe("paySO", () => {
  let data = {
    service_order_id: 1006,
  }
  let originalFunc;

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await serviceOrder.paySO(data);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the query", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.update;
    serviceOrder.databaseConnection.update = mockFunc;

    const result = await serviceOrder.paySO(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.update = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.paySO(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
  });
});

describe("GetFailedSO", () => {
  let data = {
    NIC: "972654889V",
  }
  let originalFunc;

  it("should return error when there is an error to execute the stored procedure", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.call;
    serviceOrder.databaseConnection.call = mockFunc;

    const result = await serviceOrder.GetFailedSO(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.call = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.GetFailedSO(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("resultData");
  });
});

describe("TodaySO", () => {
  let originalFunc;

  it("should return error when there is an error to execute the stored procedure", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.call;
    serviceOrder.databaseConnection.call = mockFunc;

    const result = await serviceOrder.TodaySO();

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.call = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.TodaySO();

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("resultData");
  });
});

describe("GetCustomer", () => {
  let data = {
    NIC: "972654889V",
  }
  let originalFunc;

  it("should return validation error for invalid data", async () => {
    const data = {};

    const result = await serviceOrder.GetCustomer(data);

    expect(result).toHaveProperty("validationError");
  });

  it("should return error when there is an error to execute the query", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.readSingleTable;
    serviceOrder.databaseConnection.readSingleTable = mockFunc;

    const result = await serviceOrder.GetCustomer(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.readSingleTable = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.GetCustomer(data);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("resultData");
  });
});

describe("GetMySO", () => {
  let data = {
    user_id: 3,
  }
  let originalFunc;

  it("should return error when there is an error to execute the query", async () => {
    const mockFunc = jest.fn().mockReturnValue({ error: true });
    originalFunc = serviceOrder.databaseConnection.readMultipleTable;
    serviceOrder.databaseConnection.readMultipleTable = mockFunc;

    const result = await serviceOrder.GetMySO(data.user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", true);

    serviceOrder.databaseConnection.readMultipleTable = originalFunc;
  });

  it("should return non-error object when success", async () => {
    const result = await serviceOrder.GetMySO(data.user_id);

    expect(result).toHaveProperty("connectionError", false);
    expect(result).toHaveProperty("error", false);
    expect(result).toHaveProperty("resultData");
  });
});
