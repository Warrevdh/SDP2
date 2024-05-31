const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const { withServer } = require("../helper");

const idForUser = uuidv4();
const idForCompany = uuidv4();
const idForDataNotification = uuidv4();

const data = {
  user: {
    data: {
      userId: idForUser,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe123@gmail.com",
      password: "123456",
      country: "Belgium",
      city: "Brussels",
      postalCode: "1000",
      street: "Rue de la Loi",
      addressNumber: "1",
      phoneNumber: "123456789",
      telNumber: "123456789",
    },
  },
  company: {
    data: {
      companyId: idForCompany,
      name: "name",
      logo: "logo",
    },
  },
  notification: {
    data: {
      notificationId: idForDataNotification,
      title: "title",
      shortMessage: "shortMessage",
      longMessage: "longMessage",
      companyId: idForCompany,
    },
  },
};

describe("Notification", () => {
  let request;
  let prisma;

  withServer(({ prisma: p, request: r }) => {
    prisma = p;
    request = r;
  });

  const token = jwt.sign(
    {
      iss: "https://www.localhost.com",
      sub: idForUser,
      aud: "https://www.localhost.com",
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      nbf: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      jti: idForUser,
      role: "admin",
    },
    process.env.JWT_SECRET
  );

  const url = "/api/notifications";

  beforeAll(async () => {
    await prisma.company.create(data.company);
    await prisma.notification.create(data.notification);
  });

  afterAll(async () => {
    await prisma.notification.delete({
      where: {
        notificationId: idForDataNotification,
      },
    });
    await prisma.company.delete({
      where: {
        companyId: idForCompany,
      },
    });
  });

  describe("GET /company/:companyId", () => {
    test("it should return all notifications from a company", async () => {
      const response = await request
        .get(`${url}/company/${idForCompany}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe(data.notification.data.title);
      expect(response.body[0].shortMessage).toBe(
        data.notification.data.shortMessage
      );
      expect(response.body[0].longMessage).toBe(
        data.notification.data.longMessage
      );
      expect(response.body[0].companyId).toBe(data.notification.data.companyId);
    });

    test("it should 404 if the company does not exist", async () => {
      const badId = uuidv4();
      const response = await request
        .get(`${url}/company/${badId}`)
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });

  describe("PUT /:notificationId", () => {
    test("it should update a notification", async () => {
      const response = await request
        .put(`${url}/${idForDataNotification}`)
        .send({
          title: "title",
          shortMessage: "shortMessage",
          longMessage: "longMessage",
          seen: true,
        })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.title).toBe(data.notification.data.title);
      expect(response.body.shortMessage).toBe(
        data.notification.data.shortMessage
      );
      expect(response.body.longMessage).toBe(
        data.notification.data.longMessage
      );
      expect(response.body.companyId).toBe(data.notification.data.companyId);
    });

    test("it should 404 if the notification does not exist", async () => {
      const badId = uuidv4();
      const response = await request
        .put(`${url}/${badId}`)
        .send({
          title: "title",
          shortMessage: "shortMessage",
          longMessage: "longMessage",
          seen: true,
        })
        .set("Authorization", `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });
});
