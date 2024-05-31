const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const { withServer } = require("../helper");

const idForUser = uuidv4();
const idForProduct = uuidv4();
const idForCategory = uuidv4();
const idForCompany = uuidv4();

const data = {
  user: {
    data: {
      userId: idForUser,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe5@gmail.com",
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
      name: "Company 2",
      logo: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
    },
  },
  product: {
    data: {
      productId: idForProduct,
      name: "Product 1",
      pictureImg: "https://www.google.com",
      amountInStock: "10",
      deliveryTime: "1",
      fromCompany: "Company 2",
      productListerDescription: "Product 1 description",
      productShortDescription: "Product 1 short description",
      productLongDescription: "Product 1 long description",
      categoryId: idForCategory,
    },
  },
  category: {
    data: {
      categoryId: idForCategory,
      categoryName: "Category 1",
    },
  },
};

describe("Product", () => {
  let request;
  let prisma;

  withServer(({ prisma: p, request: r }) => {
    prisma = p;
    request = r;
  });

  const url = "/api/products";

  beforeEach(async () => {
    await prisma.user.create({
      data: {
        userId: idForUser,
        firstname: data.user.data.firstname,
        lastname: data.user.data.lastname,
        email: data.user.data.email,
        password: bcrypt.hashSync("123456", 10),
        country: data.user.data.country,
        city: data.user.data.city,
        postalCode: data.user.data.postalCode,
        street: data.user.data.street,
        addressNumber: data.user.data.addressNumber,
        phoneNumber: data.user.data.phoneNumber,
        telNumber: data.user.data.telNumber,
      },
    });
    await prisma.company.create({
      data: {
        companyId: idForCompany,
        name: data.company.data.name,
        logo: data.company.data.logo,
        User: {
          connect: {
            userId: idForUser,
          },
        },
      },
    });
    await prisma.category.create({
      data: {
        categoryId: idForCategory,
        categoryName: data.category.data.categoryName,
      },
    });
    await prisma.product.create({
      data: {
        productId: idForProduct,
        name: data.product.data.name,
        pictureImg: data.product.data.pictureImg,
        amountInStock: data.product.data.amountInStock,
        deliveryTime: data.product.data.deliveryTime,
        productListerDescription: data.product.data.productListerDescription,
        productShortDescription: data.product.data.productShopperDescription,
        productLongDescription: data.product.data.productLongDescription,
        Company: {
          connect: {
            name: data.company.data.name,
          },
        },
        Category: {
          connect: {
            categoryId: idForCategory,
          },
        },
      },
    });
  });

  afterEach(async () => {
    await prisma.category.delete({
      where: {
        categoryId: idForCategory,
      },
    });
    await prisma.product.delete({
      where: {
        productId: idForProduct,
      },
    });
    await prisma.company.delete({
      where: {
        companyId: idForCompany,
      },
    });
    await prisma.user.delete({
      where: {
        userId: idForUser,
      },
    });
  });

  describe("GET /api/product", () => {
    test("it should return 200", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body[0].name).toBe(data.product.data.name);
      expect(response.body[0].pictureImg).toBe(data.product.data.pictureImg);
      expect(response.body[0].amountInStock).toBe(
        data.product.data.amountInStock
      );
      expect(response.body[0].deliveryTime).toBe(
        data.product.data.deliveryTime
      );
    });
  });

  describe("GET /api/product/:productId", () => {
    test("it should return 200", async () => {
      const response = await request.get(`${url}/${idForProduct}`);
      expect(response.status).toBe(200);
      expect(response.body.pictureImg).toBe(data.product.data.pictureImg);
      expect(response.body.amountInStock).toBe(data.product.data.amountInStock);
      expect(response.body.deliveryTime).toBe(data.product.data.deliveryTime);
    });

    test("it should return 404", async () => {
      const nonExistingId = uuidv4();
      const response = await request.get(`${url}/${nonExistingId}`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe(
        `Product with id: ${nonExistingId} does not exist`
      );
    });
  });
});
