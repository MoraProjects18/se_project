const {notExpired} = require("../../../src/controllers/sorder");

describe("notExpired", () => {
  it("should return false if the difference between given date and today is exceed 180 days", () => {
    const result = notExpired("1/1/2020");

    expect(result).toEqual(false);
  });

  it("should return true if the difference between given date and today is not exceed 180 days", () => {
    const result = notExpired("1/1/2021");

    expect(result).toEqual(true);
  });
});
