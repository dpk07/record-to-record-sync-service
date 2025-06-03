class TokenBucket {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.tokens = capacity;
    setInterval(() => {
      this.tokens = Math.min(this.tokens + refillRatePerSec, this.capacity);
    }, 1000);
  }

  tryRemoveToken() {
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }
}

module.exports = TokenBucket;