const jwt = require("jsonwebtoken");

const verifyToken = async (ctx, next) => {
  const token =
    ctx.headers.authorization ||
    ctx.request.body.token ||
    ctx.request.query.token;

  if (!token) {
    ctx.response.status = 403;
    ctx.response.body = {
      auth: false,
      message: "No token provided.",
    };
    ctx.state.user = {};
    return; // stop the process
  } else {
    try {
      const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);

      // check the role in the token
      if (
        decoded.role !== "customer" &&
        decoded.role !== "employee" &&
        decoded.role !== "admin"
      ) {
        ctx.response.status = 403;
        ctx.response.body = {
          auth: false,
          message: "You are not authorized to perform this action.",
        };
        ctx.state.user = {};
        return; // stop the process
      }
      ctx.state.user = decoded;
      await next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // If the error is a JsonWebTokenError, the token was invalid or has expired.
        ctx.throw(401, "Invalid token.");
      } else {
        if (error.code == "NOT_FOUND") ctx.throw(404, error.message);
        ctx.throw(error.status, error.message);
      }
    }
  }
};

module.exports = {
  verifyToken
};