const supertest = require("supertest");

const createServer = require("../src/createServer");
const { getPrisma } = require("../src/data");

const withServer = (setter) => {
  let server;

  beforeAll(async () => {
    server = await createServer();

    setter({
      prisma: getPrisma(),
      request: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};

module.exports = { withServer };
