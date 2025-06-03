const retry = require("../utils/retryWithBackoff");

describe("retryWithBackoff", () => {
  it("should retry until success", async () => {
    let count = 0;
    const result = await retry(() => {
      if (++count < 3) throw new Error("Fail");
      return "Success";
    });
    expect(result).toBe("Success");
  });

  it("should throw after max retries", async () => {
    let count = 0;
    await expect(retry(() => {
      count++;
      throw new Error("Always fails");
    }, 2)).rejects.toThrow("Max retries reached");
  });
});
