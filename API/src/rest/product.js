const Router = require("@koa/router");
const Joi = require("joi");

const productService = require("../service/product.js");

const validate = require("./validation.js");

const getAllProducts = async (ctx) => {
  const products = await productService.getAllProducts();
  ctx.body = products;
};
getAllProducts.validate = {};

const getProductById = async (ctx) => {
  const product = await productService.getProductById(ctx.params.productId);
  ctx.body = product;
};
getProductById.validate = {
  params: {
    productId: Joi.string().uuid().required(),
  },
};

const getProductsByCategory = async (ctx) => {
  const products = await productService.getProductsByCategory(
    ctx.params.categoryId
  );
  ctx.body = products;
};
getProductsByCategory.validate = {
  params: {
    categoryId: Joi.string().uuid().required(),
  },
};

const createProduct = async (ctx) => {
  const product = await productService.createProduct(ctx.request.body);
  ctx.body = product;
  ctx.status = 201;
};
createProduct.validate = {
  body: {
    name: Joi.string().required(),
    pictureImg: Joi.string().optional(),
    amountInStock: Joi.string().required(),
    deliveryTime: Joi.string().optional(),
    productListerDescription: Joi.string().optional(),
    productShortDescription: Joi.string().optional(),
    productLongDescription: Joi.string().optional(),
    fromCompany: Joi.string().required(),
    categoryId: Joi.string().uuid().optional(),
  },
};

const updateProduct = async (ctx) => {
  const product = await productService.updateProduct(
    ctx.params.productId,
    ctx.request.body
  );
  ctx.body = product;
};
updateProduct.validate = {
  params: {
    productId: Joi.string().uuid().required(),
  },
  body: {
    name: Joi.string().required(),
    pictureImg: Joi.string().optional(),
    amountInStock: Joi.string().required(),
    deliveryTime: Joi.string().optional(),
    categoryId: Joi.string().uuid().optional(),
  },
};

const deleteProduct = async (ctx) => {
  await productService.deleteProduct(ctx.params.productId);
  ctx.status = 204;
};
deleteProduct.validate = {
  params: {
    productId: Joi.string().uuid().required(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/products",
  });

  router.get("/", validate(getAllProducts.validate), getAllProducts);
  router.get("/:productId", validate(getProductById.validate), getProductById);
  router.get(
    "/category/:categoryId",
    validate(getProductsByCategory.validate),
    getProductsByCategory
  );

  app.use(router.routes()).use(router.allowedMethods());
};
