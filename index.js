const { initQueueWithFakeData } = require("./queue/inMemoryQueue");
const { startDispatcher } = require("./dispatcher/syncWorker");
const { startMockCRM } = require("./mock/crmApi");

(async () => {
  await startMockCRM();
  initQueueWithFakeData();
  startDispatcher();
})();
