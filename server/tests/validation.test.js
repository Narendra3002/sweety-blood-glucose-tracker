const {
  validateReading,
  SLOTS,
  isValidEmail
} = require("../src/utils");

describe("Reading validation", () => {
  test("accepts a valid reading", () => {
    expect(
      validateReading({
        date: "2026-11-01",
        slot: "Morning",
        value: 100
      })
    ).toBeNull();
  });

  test("rejects missing glucose value", () => {
    expect(
      validateReading({
        date: "2026-11-01",
        slot: "Morning",
        value: ""
      })
    ).toBe("Please enter a glucose value.");
  });

  test("rejects values outside 40-600", () => {
    expect(
      validateReading({
        date: "2026-11-01",
        slot: "Morning",
        value: 39
      })
    ).toBe("Value must be between 40 and 600 mg/dl.");
  });

  test("has exactly four allowed slots", () => {
    expect(SLOTS).toHaveLength(4);
  });

  test("validates email", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("wrong-email")).toBe(false);
  });
});
