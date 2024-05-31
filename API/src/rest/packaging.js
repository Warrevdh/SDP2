const Router = require("@koa/router");
const Joi = require("joi");

const packageService = require("../service/packaging");
// const auth = require("../core/auth");

const validate = require("./validation.js");

const getPackaging = async (ctx) => {
  const boxes = await packageService.getPackaging();
  ctx.body = boxes;
};
getPackaging.validate = {};

const getPackagingById = async (ctx) => {
  const box = await packageService.getPackagingById(ctx.params.packageId);
  ctx.body = box;
};
getPackagingById.validate = {
  params: {
    packageId: Joi.string().required(),
  },
};

const deletePackageById = async (ctx) => {
  const box = await packageService.deletePackageById(ctx.params.packageId);
  ctx.body = box;
};
deletePackageById.validate = {
  params: {
    packageId: Joi.string().required(),
  },
};

const createPackage = async (ctx) => {
  const box = await packageService.createPackage(ctx.request.body);
  ctx.body = box;
};
createPackage.validate = {
  body: {
    packageId: Joi.string().optional(),
    name: Joi.string().required(),
    price: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    length: Joi.number().required(),
    activeForDelivery: Joi.boolean().optional(),
    type: Joi.string().valid("custom", "standard").optional(),
  },
};

const updatePackageById = async (ctx) => {
  const box = await packageService.updatePackageById(
    ctx.params.packageId,
    ctx.request.body
  );
  ctx.body = box;
};
updatePackageById.validate = {
  body: {
    name: Joi.string().required(),
    price: Joi.number().required(),
    width: Joi.number().required(),
    height: Joi.number().required(),
    length: Joi.number().required(),
    activeForDelivery: Joi.boolean().optional(),
    type: Joi.string().valid("custom", "standard").optional(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/packages",
  });

  router.get("/all", validate(getPackaging.validate), getPackaging);
  router.get(
    "/:packageId",
    validate(getPackagingById.validate),
    getPackagingById
  );
  router.delete(
    "/:packageId",
    validate(deletePackageById.validate),
    deletePackageById
  );
  router.post("/create", validate(createPackage.validate), createPackage);
  router.put(
    "/:packageId",
    validate(updatePackageById.validate),
    updatePackageById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
