const datetime = require("../../../src/utils/datetime");

describe("getDate", () => {
  it("should return the current date and time seperated by a space", () => {

    const result = datetime();
    expect(result).toContain("2021-2-25");

<<<<<<< HEAD
    expect(result).toEqual(expect.stringMatching(/^2\d{3}(-\d{1,2}){2} \d{1,2}(:\d{1,2}){2}/));
=======
>>>>>>> test-lahiru
  });
});
