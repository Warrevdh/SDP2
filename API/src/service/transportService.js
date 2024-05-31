const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getAllActiveTransport = async () => {
  debugLog("Check if any transport is active");
  try {
    const transport = await getPrisma().transportService.findMany({
      where: {
        activeForDelivery: true,
      },
    });
    return transport;
  } catch (error) {
    const logger = getChildLogger("transport-service");
    logger.error("Failed to get all transport", { error });
    throw error;
  }
};

module.exports = {
  getAllActiveTransport,
};
