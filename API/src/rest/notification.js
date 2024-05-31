const Router = require("@koa/router");
const Joi = require("joi");

const notificationService = require("../service/notification");
const auth = require("../core/auth");

const validate = require("./validation.js");

const getAllNotificationsFromCompany = async (ctx) => {
  const notifications = await notificationService.getAllNotificationsFromCompany(
    ctx.params.companyId
  );
  ctx.body = notifications;
};
getAllNotificationsFromCompany.validate = {
  params: {
    companyId: Joi.string().uuid().required(),
  },
};

const updateNotification = async (ctx) => {
  const notification = await notificationService.editNotification(
    ctx.params.notificationId,
    ctx.request.body
  );
  ctx.body = notification;
};
updateNotification.validate = {
  params: {
    notificationId: Joi.string().uuid().required(),
  },
  body: {
    title: Joi.string().required(),
    shortMessage: Joi.string().required(),
    longMessage: Joi.string().required(),
    seen: Joi.boolean().required(),
  },
};

const deleteNotification = async (ctx) => {
  await notificationService.deleteNotification(ctx.params.notificationId);
};
deleteNotification.validate = {
  params: {
    notificationId: Joi.string().uuid().required(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/notifications",
  });

  router.get(
    "/company/:companyId",
    auth.verifyToken,
    validate(getAllNotificationsFromCompany.validate),
    getAllNotificationsFromCompany
  );
  router.put(
    "/:notificationId",
    auth.verifyToken,
    validate(updateNotification.validate),
    updateNotification
  );
  router.delete(
    "/:notificationId",
    auth.verifyToken,
    validate(deleteNotification.validate),
    deleteNotification
  );

  app.use(router.routes()).use(router.allowedMethods());
};