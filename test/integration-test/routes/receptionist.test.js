const request = require("supertest");
const jwt = require("jsonwebtoken");
const config = require("config");
let server;

const Database = require("../../../src/database/database");
const database = new Database();

describe("GET /receptionist/home", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 403 status code when the user type is not a receptionist", async () => {
    const data = {...payload};
    data.user_type = "not-receptionist";
    const token = jwt.sign(data, config.get("jwtPrivateKey"));

    const res = await request(server)
      .get("/receptionist/profile")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(403);
  });

  it("give 200 OK status code when the home page is succesfully retrieved", async () => {
    const res = await request(server)
      .get("/receptionist/home")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("GET /receptionist/initiate", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the so initaite page is succesfully retrieved", async () => {
    const res = await request(server)
      .get("/receptionist/initiate")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("GET /receptionist/sorder/failed", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the so continue page is succesfully retrieved", async () => {
    const res = await request(server)
      .get("/receptionist/sorder/failed")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("GET /receptionist/sorder/search", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the search page is succesfully retrieved", async () => {
    const res = await request(server)
      .get("/receptionist/sorder/search")
      .set("Cookie", [`ets-auth-token=${token}`])
      .send();

    expect(res.status).toBe(200);
  });
});

describe("POST /receptionist/sorder/initiate", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;
  const data = {
    user_id: 3,
    vehicle_number: "GH7895",
    start_date: "2022-03-09 17:31:46",
    end_date: "2022-03-09 18:41:46",
    payment_amount: 400,
  }

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 400 status code when the provided data is invalid", async () => {
    const data = {};

    const res = await request(server).post("/receptionist/sorder/initiate").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the so initiation is success", async () => {
    const res = await request(server).post("/receptionist/sorder/initiate").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });
});

describe("POST /receptionist/sorder/continue", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;
  const data = {
    service_order_id: 1004
  }

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 400 status code when the provided serice order id is invalid", async () => {
    const data = {};

    const res = await request(server).post("/receptionist/sorder/continue").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the database query can't run", async () => {
    const data = {
      service_order_id: 10000000000000000000000000000000000000000000,
    };

    const res = await request(server).post("/receptionist/sorder/continue").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the previous so continue is success", async () => {
    const res = await request(server).post("/receptionist/sorder/continue").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });
});

describe("POST /receptionist/sorder/failed", () => {
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

  it("give 200 OK status code with error page when the provided NIC is invalid", async () => {
    const data = {};

    const res = await request(server).post("/receptionist/sorder/failed").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code with error page when the provided NIC is not available in database", async () => {
    const data = {
      NIC: "911111166V"
    };

    const res = await request(server).post("/receptionist/sorder/failed").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code with error page when the provided NIC is not a customer NIC", async () => {
    const data = {
      NIC: "972654666V"
    };

    const res = await request(server).post("/receptionist/sorder/failed").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code when the failed sos are successfully retrieved", async () => {
    const res = await request(server).post("/receptionist/sorder/failed").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });
});

describe("POST /receptionist/sorder/search", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;
  const data = {
    service_order_id:1001,
  }

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code with error page when the provided service order id is invalid", async () => {
    const data = {};

    const res = await request(server).post("/receptionist/sorder/search").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code with data not found error page when the provided service order id is not available", async () => {
    const data = {
      service_order_id: 100002
    };

    const res = await request(server).post("/receptionist/sorder/search").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code when the servie order details are successfully retrieved", async () => {
    const res = await request(server).post("/receptionist/sorder/search").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });
});

describe("GET /receptionist/sorder/gettodaySO", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 200 OK status code when the today servie order details are successfully retrieved", async () => {
    const res = await request(server).get("/receptionist/sorder/gettodaySO").set("Cookie", [`ets-auth-token=${token}`]).send();

    expect(res.status).toBe(200);
  });
});

describe("POST /receptionist/initaite", () => {
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

  it("give 200 OK status code with error page when the provided NIC is invalid", async () => {
    const data = {};

    const res = await request(server).post("/receptionist/initiate").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code with error page when the provided NIC is not available in database", async () => {
    const data = {
      NIC: "911111166V"
    };

    const res = await request(server).post("/receptionist/initiate").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code with error page when the provided NIC is not a customer NIC", async () => {
    const data = {
      NIC: "972654666V"
    };

    const res = await request(server).post("/receptionist/initiate").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });

  it("give 200 OK status code when the all data is successfully retrieved", async () => {
    const res = await request(server).post("/receptionist/initiate").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);
  });
});

describe("POST /receptionist/addvehicle", () => {
  const payload = {
    user_id: 8,
    first_name: "receptionist1",
    last_name: "1receptionist",
    user_type: "receptionist",
  };
  let token;
  const data = {
    user_id: 3,
    registration_number: "GK4567",
    engine_number: "WGHF5689N13245U",
    model_number: "VC180",
    model: "Car"
  }

  beforeEach(() => {
    server = require("../../../src/app");

    token = jwt.sign(payload, config.get("jwtPrivateKey"));
  });

  afterEach(() => {
    server.close();
  });

  it("give 400 status code when the provided vehicle details are invalid", async () => {
    const data = {};

    const res = await request(server).post("/receptionist/addvehicle").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(400);
  });

  it("give 400 status code when the database insertion can't be done", async () => {
    const temp = {...data};
    temp.registration_number = "GH7895";

    const res = await request(server).post("/receptionist/addvehicle").set("Cookie", [`ets-auth-token=${token}`]).send(temp);

    expect(res.status).toBe(400);
  });

  it("give 200 OK status code when the vehicle details are successfully inserted", async () => {
    const res = await request(server).post("/receptionist/addvehicle").set("Cookie", [`ets-auth-token=${token}`]).send(data);

    expect(res.status).toBe(200);

    await database.delete("vehicle", ["registration_number", "=", data.registration_number]);
  });


});
