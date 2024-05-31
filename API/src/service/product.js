const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getAllProducts = async () => {
  debugLog("Get all products");
  try {
    const products = await getPrisma().product.findMany({
      include: {
        Category: true,
        prices: true,
        Company: true,
      },
    });

    return products;
  } catch (error) {
    const logger = getChildLogger("product-service");
    logger.error("Failed to get all products", {
      error,
    });
    throw error;
  }
};

const getProductById = async (productId) => {
  debugLog("Get product by id", {
    productId,
  });
  try {
    const product = await getPrisma().product.findUnique({
      where: {
        productId: productId,
      },
      include: {
        Category: true,
        prices: true,
        Company: true,
      },
    });
    if (!product)
      throw ServiceError.notFound(
        `Product with id: ${productId} does not exist`,
        {
          productId,
        }
      );
    return product;
  } catch (error) {
    const logger = getChildLogger("product-service");
    logger.error("Failed to get product by id", {
      error,
    });
    throw error;
  }
};

const getProductsByCategory = async (categoryId) => {
  debugLog("Get products by category", {
    categoryId,
  });
  try {
    const products = await getPrisma().product.findMany({
      where: {
        categoryId: categoryId,
      },
      include: {
        Category: true,
        prices: true,
        Company: true,
      },
    });
    return products;
  } catch (error) {
    const logger = getChildLogger("product-service");
    logger.error("Failed to get products by category", {
      error,
    });
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
};
