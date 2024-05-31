module.exports = {
  port: 9000,
  log: {
    level: "info",
    disabled: false,
  },
  pagination: {
    limit: 100,
    offset: 0,
  },
  cors: {
    origins: ["https://sdp2-web-frontend.onrender.com"],
    maxAge: 3 * 60 * 60,
  },
};
  