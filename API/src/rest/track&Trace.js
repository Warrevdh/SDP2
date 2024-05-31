const Router = require("@koa/router");
const Joi = require("joi");

const trackTraceService = require("../service/track&Trace");

const validate = require("./validation.js");

const TraceerBestelling = async (ctx) => {
  const locatie = await trackTraceService.TraceerBestelling(ctx.params);
  ctx.body = locatie;
};
TraceerBestelling.validate = {
  params: {
    trackCode: Joi.string().required(),
    verification: Joi.string().required(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/track&traces",
  });

  router.get(
    "/traceer/:trackCode/:verification",
    validate(TraceerBestelling.validate),
    TraceerBestelling
  );

  app.use(router.routes()).use(router.allowedMethods());
};
