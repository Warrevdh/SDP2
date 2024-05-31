const { getLogger } = require("../core/logger.js");
const { getPrisma } = require("../data/index.js");
const { getChildLogger } = require("../core/logger.js");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getAllOrdersFromCompany = async (companyId) => {
  debugLog("Get all orders from company", { companyId });
  try {
    const company = await getPrisma().company.findUnique({
      where: {
        companyId: companyId,
      },
    });

    if (!company) {
      throw ServiceError.notFound("Company not found", { companyId });
    }

    const orders = await getPrisma().order.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        Company: true,
        products: {
          include: {
            Product: true,
          },
        },
        Track_Trace: true,
      },
    });
    return orders;
  } catch (error) {
    const logger = getChildLogger("order-service");
    logger.error("Failed to get all orders from company", { error });
    throw error;
  }
};

const createOrder = async (data) => {
  debugLog("Creating order", { data });
  try {
    // create order
    const order = await getPrisma().order.create({
      data: {
        orderId: data.orderId,
        orderDate: data.orderDate,
        orderCountry: data.orderCountry,
        orderCity: data.orderCity,
        orderPostalCode: data.orderPostalCode,
        orderStreet: data.orderStreet,
        orderAddressNumber: data.orderAddressNumber,
        Company: {
          connect: {
            companyId: data.companyId,
          },
        },
        Packaging: {
          connect: {
            packageId: data.packagingId,
          },
        },
      },
    });

    // create order items
    const orderItems = data.orderItems.map((item) => {
      return {
        quantity: item.quantity,
        productId: item.productId,
        orderId: order.orderId,
        price: item.price,
      };
    });

    await getPrisma().order_Item.createMany({
      data: orderItems,
    });

    // create notification for customer
    await getPrisma().notification.create({
      data: {
        title: "New order",
        shortMessage: "New order has been created.",
        longMessage: `New order has been created. This order goes to ${data.orderCountry}, ${data.orderCity}, ${data.orderStreet} ${data.orderAddressNumber}. The order contains ${data.orderItems.length} items.`,
        companyId: data.companyId,
      },
    });

    // create notification for employees
    // await getPrisma().notification.create({
    //   data: {
    //     title: "New order",
    //     shortMessage: "New order has been created.",
    //     longMessage: `New order has been created. This order goes to ${data.orderCountry}, ${data.orderCity}, ${data.orderStreet} ${data.orderAddressNumber}. The order contains ${data.orderItems.length} items.`,
    //     companyId: "c91288d6-ba92-4fd3-8fb7-36e9a9aea6b0",
    //   },
    // });

    return order;
  } catch (error) {
    const logger = getChildLogger("order-service");
    logger.error("Failed to create order", { error });
    throw error;
  }
};

const updateOrderByOrderId = async (orderId, data) => {
  debugLog("Updating order by Id", {
    orderId,
    data,
  });
  try {
    // update order
    const order = await getPrisma().order.update({
      where: {
        orderId: orderId,
      },
      data: {
        orderCountry: data.orderCountry,
        orderCity: data.orderCity,
        orderStreet: data.orderStreet,
        orderStreetNumber: data.orderStreetNumber,
        orderPostalCode: data.orderPostalCode,
        packagingId: data.packagingId,
      },
    });

    // create notification
    // await getPrisma().notification.create({
    //   data: {
    //     title: "Order updated",
    //     shortMessage: "Order has been updated",
    //     longMessage: `Order with id ${orderId} has been updated. This order goes to ${data.orderCountry}, ${data.orderCity}, ${data.orderStreet} ${data.orderAddressNumber}.`,
    //     companyId: data.companyId,
    //   },
    // });
    return order;
  } catch (error) {
    const logger = getChildLogger("order-service");
    logger.error("Error while updating order by Id", { error });
    throw error;
  }
};

module.exports = {
  getAllOrdersFromCompany,
  updateOrderByOrderId,
  createOrder,
};
