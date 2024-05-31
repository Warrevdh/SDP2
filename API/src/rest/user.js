const Router = require("@koa/router");
const Joi = require("joi");

const userService = require("../service/user");
const auth = require("../core/auth");

const validate = require("./validation.js");

const registerUser = async (ctx) => {
  const user = await userService.register(ctx.request.body);
  ctx.body = user;
};
registerUser.validate = {
  body: {
    userId: Joi.string().uuid().optional(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    street: Joi.string().required(),
    addressNumber: Joi.string().required(),
    phoneNumber: Joi.string().optional(),
    telNumber: Joi.string().optional(),
    logo: Joi.string().optional(),
  },
};

const loginUser = async (ctx) => {
  const user = await userService.login(ctx.request.body);
  ctx.body = user;
};
loginUser.validate = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

const getUserById = async (ctx) => {
  const user = await userService.findUserById(ctx.state.user.sub);
  ctx.body = user;
};
getUserById.validate = {};

const updateUserById = async (ctx) => {
  const user = await userService.updateUserById(
    ctx.state.user.sub,
    ctx.request.body
  );
  ctx.body = user;
};
updateUserById.validate = {
  body: {
    firstname: Joi.string().optional(),
    lastname: Joi.string().optional(),
    email: Joi.string().email().optional(),
    oldPassword: Joi.string().optional(),
    password: Joi.string().optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    postalCode: Joi.string().optional(),
    street: Joi.string().optional(),
    addressNumber: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    telNumber: Joi.string().optional(),
    logo: Joi.string().optional(),
  },
};

const deleteUserById = async (ctx) => {
  const user = await userService.deleteUserById(ctx.state.user.sub);
  ctx.body = user;
};
deleteUserById.validate = {};

module.exports = (app) => {
  const router = new Router({
    prefix: "/users",
  });

  router.get("/", auth.verifyToken, getUserById);
  router.post("/register", validate(registerUser.validate), registerUser);
  router.post("/login", validate(loginUser.validate), loginUser);
  router.put(
    "/",
    auth.verifyToken,
    validate(updateUserById.validate),
    updateUserById
  );
  router.delete(
    "/",
    auth.verifyToken,
    validate(deleteUserById.validate),
    deleteUserById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
