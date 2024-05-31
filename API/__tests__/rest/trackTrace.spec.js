const { v4: uuidv4 } = require("uuid");

const { withServer } = require("../helper");

const idForOrder = uuidv4();
const idForCompany = uuidv4();
const idForTransport = uuidv4();
const idForPackage = uuidv4();
const idForTrackTrace = uuidv4();

const data = {
  company: {
    data: {
      companyId: idForCompany,
      name: "Test Company1",
      logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    },
  },
  trackTrace: {
    data: {
      trackTraceId: idForTrackTrace,
      transportServiceId: idForTransport,
      verificationCode: "postcode",
      trackTraceCode: "A1234567",
    },
  },
  TransportService: {
    data: {
      transportServiceId: idForTransport,
      name: "Test Transport Service",
      email: "test",
      phoneNumber: "123456789",
      trackLenght: 8,
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
      trackTraceCode: "A1234567",
    },
  },
};

describe("Track&Trace", () => {
  let request;
  let prisma;

  withServer(({ prisma: p, request: r }) => {
    prisma = p;
    request = r;
  });

  const url = "/api/track&traces";

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

  describe("GET /traceer/:trackCode/:verification", () => {
    it("should return a 200", async () => {
      const response = await request.get(
        `${url}/traceer/${data.trackTrace.data.trackTraceCode}/1000`
      );
      expect(response.status).toBe(200);
      expect(response.body.companyId).toBe(idForCompany);
      expect(response.body.orderId).toBe(idForOrder);
      expect(response.body.trackTraceCode).toBe("A1234567");
      expect(response.body.orderPostalCode).toBe(
        data.order1.data.orderPostalCode
      );
      expect(response.body.orderCountry).toBe(data.order1.data.orderCountry);
      expect(response.body.orderCity).toBe(data.order1.data.orderCity);
      expect(response.body.orderStreet).toBe(data.order1.data.orderStreet);
      expect(response.body.orderAddressNumber).toBe(
        data.order1.data.orderAddressNumber
      );
    });

    it("should return a 404", async () => {
      const response = await request.get(
        `${url}/traceer/${data.trackTrace.data.trackTraceCode}/1001`
      );
      expect(response.status).toBe(404);
    });
  });
});
