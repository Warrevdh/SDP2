const { v4: uuidv4 } = require("uuid");

const { withServer } = require("../helper");

const idForBox1 = uuidv4();
const idForBox2 = uuidv4();
const wrongId = "ddd";

const data = {
  package1: {
    data: {
      packageId: idForBox1,
      name: "box10",
      price: 20.0,
      width: 10.0,
      height: 30.0,
      length: 50.0,
      activeForDelivery: true,
      type: "standard",
    },
  },
  package2: {
    data: {
      packageId: idForBox2,
      name: "box20",
      price: 20.0,
      width: 10.0,
      height: 30.0,
      length: 50.0,
      activeForDelivery: true,
      type: "custom",
    },
  },
};

describe("Package", () => {
  let request;
  let prisma;

  withServer(({ prisma: p, request: r }) => {
    prisma = p;
    request = r;
  });

  const url = "/api/packages";

  beforeAll(async () => {
    await prisma.packaging.create(data.package1);
    await prisma.packaging.create(data.package2);
  });

  afterAll(async () => {
    await prisma.packaging.delete({
      where: {
        packageId: idForBox1,
      },
    });
    await prisma.packaging.delete({
      where: {
        packageId: idForBox2,
      },
    });
  });

  describe("POST /create", () => {
    test("it should create a new box type", async () => {
      const idForBox3 = uuidv4();
      const packageData = {
        packageId: idForBox3,
        name: "box30",
        price: 20.0,
        width: 10.0,
        height: 30.0,
        length: 50.0,
        activeForDelivery: true,
        type: "custom",
      };

      const response = await request.post(`${url}/create`).send(packageData);

      expect(response.status).toBe(200);

      expect(response.body.packageId).toBe(idForBox3);
      expect(response.body.name).toBe(packageData.name);
      expect(response.body.price).toBe(packageData.price);
      expect(response.body.width).toBe(packageData.width);
      expect(response.body.height).toBe(packageData.height);
      expect(response.body.length).toBe(packageData.length);
      expect(response.body.activeForDelivery).toBe(
        packageData.activeForDelivery
      );
      expect(response.body.type).toBe(packageData.type);
      await prisma.packaging.delete({
        where: {
          packageId: idForBox3,
        },
      });
    });
  });

  describe("GET /all", () => {
    test("it should return all boxes", async () => {
      const response = await request.get(`${url}/all`);
      expect(response.status).toBe(200);

      let box1,
        box2 = null;
      for (let i = 0; i < response.body.length; i++) {
        if (response.body[i].packageId == idForBox1) {
          box1 = i;
        }
        if (response.body[i].packageId == idForBox2) {
          box2 = i;
        }
      }
      //package 1
      expect(response.body[box1].packageId).toBe(data.package1.data.packageId);
      expect(response.body[box1].name).toBe(data.package1.data.name);
      expect(response.body[box1].price).toBe(data.package1.data.price);
      expect(response.body[box1].width).toBe(data.package1.data.width);
      expect(response.body[box1].height).toBe(data.package1.data.height);
      expect(response.body[box1].length).toBe(data.package1.data.length);
      expect(response.body[box1].activeForDelivery).toBe(
        data.package1.data.activeForDelivery
      );
      expect(response.body[box1].type).toBe(data.package1.data.type);

      //package 2
      expect(response.body[box2].packageId).toBe(data.package2.data.packageId);
      expect(response.body[box2].name).toBe(data.package2.data.name);
      expect(response.body[box2].price).toBe(data.package2.data.price);
      expect(response.body[box2].width).toBe(data.package2.data.width);
      expect(response.body[box2].height).toBe(data.package2.data.height);
      expect(response.body[box2].length).toBe(data.package2.data.length);
      expect(response.body[box2].activeForDelivery).toBe(
        data.package2.data.activeForDelivery
      );
      expect(response.body[box2].type).toBe(data.package2.data.type);
    });
  });

  describe("GET /:packageId", () => {
    test("it should return all the details about one box", async () => {
      const response = await request.get(`${url}/${idForBox1}`);

      expect(response.status).toBe(200);
      expect(response.body.packageId).toBe(data.package1.data.packageId);
      expect(response.body.name).toBe(data.package1.data.name);
      expect(response.body.price).toBe(data.package1.data.price);
      expect(response.body.width).toBe(data.package1.data.width);
      expect(response.body.height).toBe(data.package1.data.height);
      expect(response.body.length).toBe(data.package1.data.length);
      expect(response.body.activeForDelivery).toBe(
        data.package1.data.activeForDelivery
      );
      expect(response.body.type).toBe(data.package1.data.type);
    });
  });

  test("it should not find the package", async () => {
    const response = await request.get(`${url}/${wrongId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Box with id ${wrongId} not found`);
  });

  describe("DELETE /:packageId", () => {
    test("it should delete a package", async () => {
      const response = await request.delete(`${url}/${idForBox1}`);

      expect(response.status).toBe(200);
      expect(response.body.packageId).toBe(data.package1.data.packageId);
      expect(response.body.name).toBe(data.package1.data.name);
      expect(response.body.price).toBe(data.package1.data.price);
      expect(response.body.width).toBe(data.package1.data.width);
      expect(response.body.height).toBe(data.package1.data.height);
      expect(response.body.length).toBe(data.package1.data.length);
      expect(response.body.activeForDelivery).toBe(
        data.package1.data.activeForDelivery
      );
      expect(response.body.type).toBe(data.package1.data.type);

      await prisma.packaging.create(data.package1);
    });
  });

  test("it should not delete a package", async () => {
    const response = await request.delete(`${url}/${wrongId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe(`Box with id ${wrongId} not found`);
  });

  // describe("PUT /:notificationId", () => {
  //   test("it should update a notification", async () => {
  //     const response = await request
  //       .put(`${url}/${idForDataNotification}`)
  //       .send({
  //         title: "title",
  //         shortMessage: "shortMessage",
  //         longMessage: "longMessage",
  //         seen: true,
  //       });
  //     expect(response.status).toBe(200);
  //     expect(response.body.title).toBe(data.notification.data.title);
  //     expect(response.body.shortMessage).toBe(
  //       data.notification.data.shortMessage
  //     );
  //     expect(response.body.longMessage).toBe(
  //       data.notification.data.longMessage
  //     );
  //     expect(response.body.userId).toBe(data.notification.data.userId);
  //   });
  // });
});
