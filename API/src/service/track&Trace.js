const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError.js");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const TraceerBestelling = async (data) => {
  debugLog("Get location of package", { data });
  try {
    const TrackTraceCode = await getPrisma().track_Trace.findUnique({
      where: {
        trackTraceCode: data.trackCode,
      },
    });

    if (TrackTraceCode == null) {
      throw ServiceError.notFound("No Track&Trace code was found", { data });
    }

    if (TrackTraceCode.verificationCode == "postcode") {
      const order = await getPrisma().order.findUnique({
        where: {
          trackTraceCode: data.trackCode,
        },
      });
      if (order.orderPostalCode != data.verification) {
        throw ServiceError.notFound("Incorrect validationCode", { data });
      }
      return order;
    } else if (TrackTraceCode.verificationCode == "orderid") {
      const order = await getPrisma().order.findUnique({
        where: {
          trackTraceCode: data.trackCode,
        },
      });

      if (order.orderId != data.verification) {
        throw ServiceError.notFound("Incorrect validationCode", { data });
      }
      return order;
    }
  } catch (error) {
    const logger = getChildLogger("track&trace-service");
    logger.error("Failed to get package location", { error });
    throw error;
  }
};

module.exports = {
  TraceerBestelling,
};
