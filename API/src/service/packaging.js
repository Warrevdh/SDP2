const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getPackaging = async () => {
  debugLog("Get all boxes");
  try {
    const boxes = await getPrisma().packaging.findMany();

    //add only admin access

    return boxes;
  } catch (error) {
    const logger = getChildLogger("packaging-service");
    logger.error("Failed to get all boxes", { error });
    throw error;
  }
};

const getPackagingById = async (packageId) => {
  debugLog("Get box by id", { packageId });
  try {
    const box = await getPrisma().packaging.findUnique({
      where: {
        packageId: packageId,
      },
    });

    if (box == null) {
      throw ServiceError.notFound(`Box with id ${packageId} not found`, {
        packageId,
      });
    }
    //add only admin access
    return box;
  } catch (error) {
    const logger = getChildLogger("packaging-service");
    logger.error(`Failed to get box with Id ${packageId}`, { error });
    throw error;
  }
};

const getPackagingByName = async (name) => {
  debugLog("Get box by name", { name });
  try {
    const box = await getPrisma().packaging.findUnique({
      where: {
        name: name,
      },
    });

    //add only admin access
    return box;
  } catch (error) {
    const logger = getChildLogger("packaging-service");
    logger.error("Failed to get box by name", { error });
    throw error;
  }
};

const updatePackageById = async (packageId, data) => {
  debugLog("Updating box by Id", { packageId });

  try {
    const existingBox = await getPackagingById(packageId);
    if (!existingBox) {
      throw ServiceError.notFound(`Box with id ${packageId} not found`, {
        packageId,
      });
    }
    const existingBoxName = await getPackagingByName(data.name);
    if (existingBoxName != null) {
      throw ServiceError.notFound(
        `Box with name ${data.name} allready exists`,
        {
          packageId,
        }
      );
    }
    const box = await getPrisma().packaging.update({
      where: {
        packageId: packageId,
      },
      data: {
        name: data.name,
        price: data.price,
        width: data.width,
        height: data.height,
        length: data.length,
        activeForDelivery: data.activeForDelivery,
        type: data.type,
      },
    });
    return box;
  } catch (error) {
    const logger = getChildLogger("packaging-service");
    logger.error("Failed to update box", { error });
    throw error;
  }
};

const deletePackageById = async (packageId) => {
  debugLog("Delete box by Id", { packageId });
  try {
    const existingBox = await getPackagingById(packageId);
    if (!existingBox) {
      throw ServiceError.notFound(`Box with id ${packageId} not found`, {
        packageId,
      });
    }
    const box = await getPrisma().packaging.delete({
      where: {
        packageId: packageId,
      },
    });
    return box;
  } catch (error) {
    const logger = getChildLogger("packaging-service");
    logger.error("Failed to delete box", { error });
    throw error;
  }
};

const createPackage = async (data) => {
  debugLog("Creating box");
  try {

    const box = await getPrisma().packaging.create({
      data: {
        packageId: data.packageId,
        name: data.name,
        price: data.price,
        width: data.width,
        height: data.height,
        length: data.length,
        activeForDelivery: data.activeForDelivery,
        type: data.type,
      },
    });

    //add only admin access

    return box;
  } catch (error) {
    const logger = getChildLogger("packaging-service");
    logger.error("Failed to create box", { error });
    throw error;
  }
};

module.exports = {
  getPackaging,
  getPackagingById,
  deletePackageById,
  createPackage,
  updatePackageById,
};
