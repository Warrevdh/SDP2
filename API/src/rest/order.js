const Router = require("@koa/router");
const Joi = require("joi");

const orderService = require("../service/order");
const auth = require("../core/auth");

const validate = require("./validation.js");

const getAllOrdersFromCompany = async (ctx) => {
  const orders = await orderService.getAllOrdersFromCompany(
    ctx.params.companyId
  );
  ctx.body = orders;
};
getAllOrdersFromCompany.validate = {
  params: {
    companyId: Joi.string().required(),
  },
};

const createOrder = async (ctx) => {
  const order = await orderService.createOrder(ctx.request.body);
  ctx.body = order;
  ctx.status = 201;
};
createOrder.validate = {
  body: {
    orderId: Joi.string().optional(),
    orderDate: Joi.date().optional(),
    orderCountry: Joi.string().required(),
    orderCity: Joi.string().required(),
    orderStreet: Joi.string().required(),
    orderPostalCode: Joi.string().required(),
    orderAddressNumber: Joi.string().required(),
    companyId: Joi.string().uuid().required(),
    packagingId: Joi.string().required(),
    orderItems: Joi.array().items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
      })
    ),
  },
};

const updateOrder = async (ctx) => {
  const order = await orderService.updateOrderByOrderId(
    ctx.params.orderId,
    ctx.request.body
  );
  ctx.body = order;
};
updateOrder.validate = {
  params: {
    orderId: Joi.string().required(),
  },
  body: {
    orderCountry: Joi.string().optional(),
    orderCity: Joi.string().optional(),
    orderStreet: Joi.string().optional(),
    orderPostalCode: Joi.string().optional(),
    orderAddressNumber: Joi.string().optional(),
    packagingId: Joi.string().uuid().optional(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/orders",
  });

  router.get(
    "/company/:companyId",
    auth.verifyToken,
    validate(getAllOrdersFromCompany.validate),
    getAllOrdersFromCompany
  );
  router.post(
    "/",
    auth.verifyToken,
    validate(createOrder.validate),
    createOrder
  );
  router.put(
    "/:orderId",
    auth.verifyToken,
    validate(updateOrder.validate),
    updateOrder
  );

  app.use(router.routes()).use(router.allowedMethods());
};
