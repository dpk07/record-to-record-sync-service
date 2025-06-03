async function retry(fn, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      const wait = Math.pow(2, i) * 100 + Math.random() * 100;
      console.log(`Retry ${i + 1}: waiting ${wait}ms`);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw new Error("Max retries reached");
}

module.exports = retry;