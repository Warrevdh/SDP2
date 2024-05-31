const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const { withServer } = require("../helper");

const idForOrder = uuidv4();
const idForCompany = uuidv4();
const idForTransport = uuidv4();
const idForPackage = uuidv4();
const idForUser = uuidv4();
const idForTrackTrace = uuidv4();

const data = {
  user: {
    data: {
      userId: idForUser,
      firstname: "John",
      lastname: "Doe",
      email: "johndoe258@gmail.com",
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
      name: "Test Company2",
      logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    },
  },
  trackTrace: {
    data: {
      trackTraceId: idForTrackTrace,
      transportServiceId: idForTransport,
      verificationCode: "postcode",
      trackTraceCode: "A12345678",
    },
  },
  TransportService: {
    data: {
      transportServiceId: idForTransport,
      name: "transportService123",
      email: "test",
      phoneNumber: "123456789",
      trackLenght: 9,
      trackOnlyNumbers: true,
      trackPrefix: "A",
    },
  },
  packaging: {
    data: {
      packageId: idForPackage,
      name: "Test Packaging",
      price: 10,
      width: 10,
      height: 10,
      length: 10,
    },
  },
  order1: {
    data: {
      orderId: idForOrder,
      orderCountry: "Belgium",
      orderCity: "Brussels",
      orderPostalCode: "1000",
      orderStreet: "Rue de la Loi",
      orderAddressNumber: "1",
      orderDate: new Date("2021-01-01"),
      status: "placed",
      companyId: idForCompany,
      packagingId: idForPackage,
      trackTraceCode: "A12345678",
    },
  },
};

describe("TransportService", () => {
  let request;
  let prisma;
  const tokenForAdmin = jwt.sign(
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

  withServer(({ prisma: p, request: r }) => {
    prisma = p;
    request = r;
  });

  const url = "/api/transport";

  beforeAll(async () => {
    await prisma.packaging.create({
      data: data.packaging.data,
    });
    await prisma.company.create({
      data: data.company.data,
    });
    await prisma.transportService.create({
      data: data.TransportService.data,
    });
    await prisma.track_Trace.create({
      data: data.trackTrace.data,
    });
    await prisma.order.create({
      data: data.order1.data,
    });
  });

  afterAll(async () => {
    await prisma.order.delete({
      where: {
        orderId: idForOrder,
      },
    });
    await prisma.track_Trace.delete({
      where: {
        trackTraceId: idForTrackTrace,
      },
    });
    await prisma.transportService.delete({
      where: {
        transportServiceId: idForTransport,
      },
    });
    await prisma.company.delete({
      where: {
        companyId: idForCompany,
      },
    });
    await prisma.packaging.delete({
      where: {
        packageId: idForPackage,
      },
    });
  });

  describe("GET /", () => {
    test("it should return all active transport services", async () => {
      const response = await request
        .get(url)
        .set("Authorization", "Bearer " + tokenForAdmin);

      expect(response.status).toBe(200);
    });

    test("it should 403 when no token is provided", async () => {
      const response = await request.get(url);

      expect(response.status).toBe(403);
    });
  });
});
