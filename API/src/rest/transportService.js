const Router = require("@koa/router");

const transportService = require("../service/transportService.js");
const auth = require("../core/auth");

const validate = require("./validation.js");

const getAllActiveTransport = async (ctx) => {
  const transport = await transportService.getAllActiveTransport();
  ctx.body = transport;
};
getAllActiveTransport.validate = {};

module.exports = (app) => {
  const router = new Router({
    prefix: "/transport",
  });

  router.get(
    "/",
    auth.verifyToken,
    validate(getAllActiveTransport.validate),
    getAllActiveTransport
  );

  app.use(router.routes()).use(router.allowedMethods());
};
