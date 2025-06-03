const TokenBucket = require("../limiter/tokenBucket");

describe("TokenBucket", () => {
  it("should allow tokens up to capacity", () => {
    const bucket = new TokenBucket(2, 0);
    expect(bucket.tryRemoveToken()).toBe(true);
    expect(bucket.tryRemoveToken()).toBe(true);
    expect(bucket.tryRemoveToken()).toBe(false);
  });

  it("should refill tokens over time", (done) => {
    const bucket = new TokenBucket(1, 1);
    bucket.tryRemoveToken(); // now empty

    setTimeout(() => {
      expect(bucket.tryRemoveToken()).toBe(true);
      done();
    }, 1100);
  });
});
