const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { withServer } = require("../helper");

const idForUser = uuidv4();
const idForCompany = uuidv4();
const idForProduct = uuidv4();
const idForCategory = uuidv4();
const idForOrder = uuidv4();
const idForPrice = uuidv4();
const idForPackage = uuidv4();
const idForTransport = uuidv4();

const data = {
  user: {
    data: {
      userId: idForUser,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe10@gmail.com",
      password: "123456",
      country: "Belgium",
      city: "Brussels",
      postalCode: "1000",
      street: "Rue de la Loi",
      addressNumber: "1",
      phoneNumber: "123456789",
      telNumber: "123456789",
      companyId: idForCompany,
    },
  },
  company1: {
    data: {
      companyId: idForCompany,
      name: "Company 1",
      logo: "https://www.google.com",
    },
  },
  company2: {
    data: {
      companyId: "c91288d6-ba92-4fd3-8fb7-36e9a9aea6b0",
      name: "delaware",
      logo: "https://www.google.com",
    },
  },
  category: {
    data: {
      categoryId: idForCategory,
      categoryName: "Category 1",
    },
  },
  price: {
    data: {
      priceId: idForPrice,
      productId: idForProduct,
      price: 10,
      validFrom: new Date("2021-01-01"),
      currencyId: "EUR",
    },
  },
  product: {
    data: {
      productId: idForProduct,
      name: "Product 1",
      pictureImg: "https://www.google.com",
      amountInStock: "10",
      deliveryTime: "1",
      fromCompany: "Company 1",
      productListerDescription: "Product 1 description",
      productShortDescription: "Product 1 short description",
      productLongDescription: "Product 1 long description",
      categoryId: idForCategory,
    },
  },
  order: {
    data: {
      orderId: idForOrder,
      orderCountry: "Belgium",
      orderCity: "Brussels",
      orderPostalCode: "1000",
      orderStreet: "Rue de la Loi",
      orderAddressNumber: "1",
      orderDate: new Date("2021-01-01"),
      transportId: idForTransport,
      companyId: idForCompany,
      packagingId: idForPackage,
    },
  },
  orderItem: {
    data: {
      orderId: idForOrder,
      productId: idForProduct,
      quantity: 1,
      price: 10,
    },
  },
  packaging: {
    data: {
      packagingId: idForPackage,
      name: "Packaging 1",
      price: 10,
      width: 10,
      height: 10,
      length: 10,
      activeForDelivery: true,
    },
  },
  transportService: {
    data: {
      transportId: idForTransport,
      name: "Transport 1",
      phoneNumber: "123456789",
      email: "transport@gmail.com",
      trackPrefix: "123",
      activeForDelivery: true,
      trackLenght: 10,
      trackOnlyNumbers: true,
      verificationCode: "postcode",
    },
  },
};

describe("Product", () => {
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

  const url = "/api/orders";

  beforeAll(async () => {
    await prisma.company.create({
      data: {
        companyId: data.company1.data.companyId,
        name: data.company1.data.name,
        logo: data.company1.data.logo,
      },
    });
    await prisma.company.create({
      data: {
        companyId: data.company2.data.companyId,
        name: data.company2.data.name,
        logo: data.company2.data.logo,
      },
    });
    await prisma.user.create({
      data: {
        userId: data.user.data.userId,
        firstname: data.user.data.firstname,
        lastname: data.user.data.lastname,
        email: data.user.data.email,
        password: bcrypt.hashSync(data.user.data.password, 10),
        country: data.user.data.country,
        city: data.user.data.city,
        postalCode: data.user.data.postalCode,
        street: data.user.data.street,
        addressNumber: data.user.data.addressNumber,
        phoneNumber: data.user.data.phoneNumber,
        telNumber: data.user.data.telNumber,
        companyId: data.user.data.companyId,
      },
    });
    await prisma.category.create({
      data: {
        categoryId: data.category.data.categoryId,
        categoryName: data.category.data.categoryName,
      },
    });
    await prisma.product.create({
      data: {
        productId: data.product.data.productId,
        name: data.product.data.name,
        pictureImg: data.product.data.pictureImg,
        amountInStock: data.product.data.amountInStock,
        deliveryTime: data.product.data.deliveryTime,
        fromCompany: data.product.data.fromCompany,
        productListerDescription: data.product.data.productListerDescription,
        productShortDescription: data.product.data.productShortDescription,
        productLongDescription: data.product.data.productLongDescription,
        categoryId: data.product.data.categoryId,
      },
    });
    await prisma.price.create({
      data: {
        priceId: data.price.data.priceId,
        productId: data.price.data.productId,
        price: data.price.data.price,
        validFrom: data.price.data.validFrom,
        currencyId: data.price.data.currencyId,
      },
    });
    await prisma.transportService.create({
      data: {
        transportServiceId: data.transportService.data.transportId,
        name: data.transportService.data.name,
        phoneNumber: data.transportService.data.phoneNumber,
        email: data.transportService.data.email,
        activeForDelivery: data.transportService.data.activeForDelivery,
        trackPrefix: data.transportService.data.trackPrefix,
        trackLenght: data.transportService.data.trackLenght,
        trackOnlyNumbers: data.transportService.data.trackOnlyNumbers,
      },
    });
    await prisma.packaging.create({
      data: {
        packageId: data.packaging.data.packagingId,
        name: data.packaging.data.name,
        price: data.packaging.data.price,
        width: data.packaging.data.width,
        height: data.packaging.data.height,
        length: data.packaging.data.length,
        activeForDelivery: data.packaging.data.activeForDelivery,
      },
    });
    await prisma.order.create({
      data: {
        orderId: data.order.data.orderId,
        companyId: data.order.data.companyId,
        orderCountry: data.order.data.orderCountry,
        orderCity: data.order.data.orderCity,
        orderPostalCode: data.order.data.orderPostalCode,
        orderStreet: data.order.data.orderStreet,
        orderAddressNumber: data.order.data.orderAddressNumber,
        orderDate: data.order.data.orderDate,

        transportId: data.order.data.transportId,
        packagingId: data.order.data.packagingId,
      },
    });
    await prisma.order_Item.create({
      data: {
        orderId: data.orderItem.data.orderId,
        productId: data.orderItem.data.productId,
        quantity: data.orderItem.data.quantity,
        price: data.orderItem.data.price,
      },
    });
  });

  afterAll(async () => {
    await prisma.order_Item.deleteMany();
    await prisma.order.delete({
      where: {
        orderId: idForOrder,
      },
    });
    await prisma.packaging.delete({
      where: {
        packageId: data.packaging.data.packagingId,
      },
    });
    await prisma.transportService.delete({
      where: {
        transportServiceId: data.transportService.data.transportId,
      },
    });
    await prisma.price.delete({
      where: {
        priceId: data.price.data.priceId,
      },
    });
    await prisma.product.delete({
      where: {
        productId: data.product.data.productId,
      },
    });
    await prisma.category.delete({
      where: {
        categoryId: data.category.data.categoryId,
      },
    });
    await prisma.user.delete({
      where: {
        userId: data.user.data.userId,
      },
    });
    await prisma.notification.deleteMany();
    await prisma.company.delete({
      where: {
        companyId: data.company1.data.companyId,
      },
    });
    await prisma.company.delete({
      where: {
        companyId: data.company2.data.companyId,
      },
    });
  });

  describe("GET /company/:companyId", () => {
    test("it should return 200", async () => {
      const response = await request
        .get(`${url}/company/${idForCompany}`)
        .set("Authorization", `Bearer ${tokenForAdmin}`);
      expect(response.status).toBe(200);
      expect(response.body[0].companyId).toBe(idForCompany);
      expect(response.body[0].orderCountry).toBe(data.order.data.orderCountry);
      expect(response.body[0].orderCity).toBe(data.order.data.orderCity);
      expect(response.body[0].orderPostalCode).toBe(
        data.order.data.orderPostalCode
      );
      expect(response.body[0].orderStreet).toBe(data.order.data.orderStreet);
      expect(response.body[0].orderAddressNumber).toBe(
        data.order.data.orderAddressNumber
      );
      expect(response.body[0].orderDate).toBe("2021-01-01T00:00:00.000Z");
      expect(response.body[0].status).toBe("Placed");
      expect(response.body[0].transportId).toBe(data.order.data.transportId);
      expect(response.body[0].packagingId).toBe(data.order.data.packagingId);
      expect(response.body[0].orderId).toBe(data.order.data.orderId);
    });

    test("it should return 404", async () => {
      const response = await request
        .get(`${url}/company/${idForCompany}1`)
        .set("Authorization", `Bearer ${tokenForAdmin}`);
      expect(response.status).toBe(404);
    });
  });

  describe("POST /", () => {
    test("it should return 201 and create an order", async () => {
      const newId = uuidv4();
      const response = await request
        .post(`${url}/`)
        .set("Authorization", `Bearer ${tokenForAdmin}`)
        .send({
          orderId: newId,
          companyId: data.order.data.companyId,
          orderCountry: "Poland",
          orderCity: data.order.data.orderCity,
          orderPostalCode: data.order.data.orderPostalCode,
          orderStreet: data.order.data.orderStreet,
          orderAddressNumber: data.order.data.orderAddressNumber,
          orderDate: data.order.data.orderDate,
          packagingId: data.order.data.packagingId,
          orderItems: [
            {
              productId: data.orderItem.data.productId,
              quantity: data.orderItem.data.quantity,
              price: data.orderItem.data.price,
            },
          ],
        });

      expect(response.status).toBe(201);
      expect(response.body.companyId).toBe(data.order.data.companyId);
      expect(response.body.orderCountry).toBe("Poland");
      expect(response.body.orderCity).toBe(data.order.data.orderCity);
      expect(response.body.orderPostalCode).toBe(
        data.order.data.orderPostalCode
      );
      expect(response.body.orderStreet).toBe(data.order.data.orderStreet);
      expect(response.body.orderAddressNumber).toBe(
        data.order.data.orderAddressNumber
      );
      expect(response.body.status).toBe("Placed");
      expect(response.body.packagingId).toBe(data.order.data.packagingId);
      expect(response.body.orderId).toBe(newId);

      await prisma.order_Item.deleteMany();
      await prisma.order.delete({
        where: {
          orderId: newId,
        },
      });
    });

    test("it should return 400", async () => {
      const response = await request
        .post(`${url}/`)
        .set("Authorization", `Bearer ${tokenForAdmin}`)
        .send({
          companyId: data.order.data.companyId,
          orderCountry: data.order.data.orderCountry,
          orderCity: data.order.data.orderCity,
          orderPostalCode: data.order.data.orderPostalCode,
          orderStreet: data.order.data.orderStreet,
          orderAddressNumber: data.order.data.orderAddressNumber,
          transportId: data.order.data.transportId,
          packagingId: data.order.data.packagingId,
        });
      expect(response.status).toBe(400);
    });
  });
});
