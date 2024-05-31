const Router = require("@koa/router");

const installHealthRouter = require("./health");
const intallUsersRouter = require("./user");
const installNotificationRouter = require("./notification");
const installOrderRouter = require("./order");
const installPackageRouter = require("./packaging");
const installProductRouter = require("./product");
const installTrackTraceRouter = require("./track&Trace");
const installTransportServiceRouter = require("./transportService");

module.exports = (app) => {
  const router = new Router({
    prefix: "/api",
  });

  installNotificationRouter(router);
  intallUsersRouter(router);
  installOrderRouter(router);
  installPackageRouter(router);
  installProductRouter(router);
  installTrackTraceRouter(router);
  installTransportServiceRouter(router);

  installHealthRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
