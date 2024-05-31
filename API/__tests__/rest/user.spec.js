const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { withServer } = require("../helper");

const idForUser = uuidv4();
const data = {
  user: {
    data: {
      userId: idForUser,
      firstname: "John",
      lastname: "Doe",
      email: "johndoe1@gmail.com",
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
};

describe("User", () => {
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

  const url = "/api/users";

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
  });

  afterEach(async () => {
    await prisma.user.delete({
      where: {
        userId: idForUser,
      },
    });
  });

  describe("POST /register", () => {
    test("it should register a new user", async () => {
      await prisma.user.delete({
        where: {
          userId: idForUser,
        },
      });
      const response = await request
        .post(`${url}/register`)
        .send(data.user.data);
      expect(response.status).toBe(200);
      expect(response.body.userId).toBe(idForUser);
      expect(response.body.firstname).toBe(data.user.data.firstname);
      expect(response.body.lastname).toBe(data.user.data.lastname);
      expect(response.body.email).toBe(data.user.data.email);
      expect(response.body.country).toBe(data.user.data.country);
      expect(response.body.city).toBe(data.user.data.city);
      expect(response.body.postalCode).toBe(data.user.data.postalCode);
      expect(response.body.street).toBe(data.user.data.street);
      expect(response.body.addressNumber).toBe(data.user.data.addressNumber);
      expect(response.body.phoneNumber).toBe(data.user.data.phoneNumber);
      expect(response.body.telNumber).toBe(data.user.data.telNumber);
    });
  });

  describe("POST /login", () => {
    test("it should login a user", async () => {
      const response = await request.post(`${url}/login`).send({
        email: data.user.data.email,
        password: data.user.data.password,
      });
      expect(response.status).toBe(200);
      expect(response.body.userId).toBe(idForUser);
      expect(response.body.firstname).toBe(data.user.data.firstname);
      expect(response.body.lastname).toBe(data.user.data.lastname);
      expect(response.body.email).toBe(data.user.data.email);
      expect(response.body.country).toBe(data.user.data.country);
      expect(response.body.city).toBe(data.user.data.city);
      expect(response.body.postalCode).toBe(data.user.data.postalCode);
      expect(response.body.street).toBe(data.user.data.street);
      expect(response.body.addressNumber).toBe(data.user.data.addressNumber);
      expect(response.body.phoneNumber).toBe(data.user.data.phoneNumber);
      expect(response.body.telNumber).toBe(data.user.data.telNumber);
    });
  });

  describe("PUT /", () => {
    test("it should update a user", async () => {
      const response = await request
        .put(`${url}`)
        .set("Authorization", `Bearer ${tokenForAdmin}`)
        .send({
          firstname: "newfirstname",
          lastname: "newlastname",
          email: "newmail@mail.com",
          oldPassword: "123456",
          password: "newpassword",
          country: "newcountry",
          city: "newcity",
          postalCode: "newpostalCode",
          street: "newstreet",
          addressNumber: "newaddressNumber",
          phoneNumber: "newphoneNumber",
          telNumber: "newtelNumber",
          logo: "newlogo",
        });
      expect(response.status).toBe(200);
      expect(response.body.userId).toBe(idForUser);
      expect(response.body.firstname).toBe("newfirstname");
      expect(response.body.lastname).toBe("newlastname");
      expect(response.body.email).toBe("newmail@mail.com");
      expect(response.body.country).toBe("newcountry");
      expect(response.body.city).toBe("newcity");
      expect(response.body.postalCode).toBe("newpostalCode");
      expect(response.body.street).toBe("newstreet");
      expect(response.body.addressNumber).toBe("newaddressNumber");
      expect(response.body.phoneNumber).toBe("newphoneNumber");
      expect(response.body.telNumber).toBe("newtelNumber");
    });

    test("it should not update a user with wrong old password", async () => {
      const response = await request
        .put(`${url}`)
        .set("Authorization", `Bearer ${tokenForAdmin}`)
        .send({
          firstname: "newfirstname",
          lastname: "newlastname",
          email: "newmail@mail.com",
          oldPassword: "wrongpassword",
          password: "newpassword",
          country: "newcountry",
          city: "newcity",
          postalCode: "newpostalCode",
          street: "newstreet",
          addressNumber: "newaddressNumber",
          phoneNumber: "newphoneNumber",
          telNumber: "newtelNumber",
        });
      expect(response.status).toBe(500);
    });

    test("it should not update a user", async () => {
      const response = await request.put(`${url}`).send({
        firstname: "newfirstname",
        lastname: "newlastname",
        email: "newmail@mail.com",
        oldPassword: "123456",
        password: "newpassword",
        country: "newcountry",
        city: "newcity",
        postalCode: "newpostalCode",
        street: "newstreet",
        addressNumber: "newaddressNumber",
        phoneNumber: "newphoneNumber",
        telNumber: "newtelNumber",
      });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("No token provided.");
    });
  });

  describe("DELETE /", () => {
    test("it should delete a user", async () => {
      const response = await request
        .delete(`${url}`)
        .set("Authorization", `Bearer ${tokenForAdmin}`);
      expect(response.status).toBe(200);
      expect(response.body.userId).toBe(idForUser);
      expect(response.body.firstname).toBe(data.user.data.firstname);
      expect(response.body.lastname).toBe(data.user.data.lastname);
      expect(response.body.email).toBe(data.user.data.email);
      expect(response.body.country).toBe(data.user.data.country);
      expect(response.body.city).toBe(data.user.data.city);
      expect(response.body.postalCode).toBe(data.user.data.postalCode);
      expect(response.body.street).toBe(data.user.data.street);
      expect(response.body.addressNumber).toBe(data.user.data.addressNumber);
      expect(response.body.phoneNumber).toBe(data.user.data.phoneNumber);
      expect(response.body.telNumber).toBe(data.user.data.telNumber);

      await prisma.user.create({
        data: {
          userId: idForUser,
          firstname: data.user.data.firstname,
          lastname: data.user.data.lastname,
          email: data.user.data.email,
          password: data.user.data.password,
          country: data.user.data.country,
          city: data.user.data.city,
          postalCode: data.user.data.postalCode,
          street: data.user.data.street,
          addressNumber: data.user.data.addressNumber,
          phoneNumber: data.user.data.phoneNumber,
          telNumber: data.user.data.telNumber,
        },
      });
    });

    test("it should not delete a user", async () => {
      const response = await request.delete(`${url}`);
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("No token provided.");
    });
  });
});
