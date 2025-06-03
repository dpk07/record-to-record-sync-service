const validators = require("../validators");

describe("Validators", () => {
  it("salesforce should validate valid payload", () => {
    expect(validators.salesforce({ id: 1, name: "Test" })).toBe(true);
  });

  it("salesforce should reject invalid payload", () => {
    expect(validators.salesforce({ id: "a", name: "Test" })).toBe(false);
  });

  it("hubspot should validate valid payload", () => {
    expect(validators.hubspot({ id: 2, name: "User" })).toBe(true);
  });

  it("hubspot should reject invalid payload", () => {
    expect(validators.hubspot(null)).toBe(false);
  });
});
