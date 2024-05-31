const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.transportService.upsert({
    where: { name: "DHL" },
    update: {},
    create: {
      transportServiceId: "85ff6163-4e3c-497c-b767-bd211497718f",
      name: "DHL",
      phoneNumber: "0487625435",
      email: "DHL@gmail.com",
    },
  });

  await prisma.transportService.upsert({
    where: { name: "PostNL" },
    update: {},
    create: {
      transportServiceId: "85ff6163-7b9s-497c-b767-bd211497718f",
      name: "PostNL",
      phoneNumber: "0481525435",
      email: "PostNL@gmail.com",
    },
  });

  await prisma.transportService.upsert({
    where: { name: "DPD" },
    update: {},
    create: {
      transportServiceId: "85ff6163-7b9s-654t-b767-bd211497718f",
      name: "DPD",
      phoneNumber: "0481545435",
      email: "DPD@gmail.com",
    },
  });

  await prisma.packaging.upsert({
    where: { packageId: "1" },
    update: {},
    create: {
      packageId: "1",
      name: "Box1",
      price: 69.69,
      width: 20.0,
      height: 10.0,
      length: 30.0,
      activeForDelivery: true,
      type: "standard",
    },
  });
  await prisma.packaging.upsert({
    where: { packageId: "2" },
    update: {},
    create: {
      packageId: "2",
      name: "Box2",
      price: 420.00,
      width: 30.0,
      height: 20.0,
      length: 10.0,
      activeForDelivery: false,
      type: "custom",
    },
  });
  await prisma.packaging.upsert({
    where: { packageId: "3" },
    update: {},
    create: {
      packageId: "3",
      name: "Box3",
      price: 10.0,
      width: 50.0,
      height: 30.0,
      length: 10.0,
      activeForDelivery: true,
      type: "custom",
    },
  });

  await prisma.track_Trace.upsert({
    where: { trackTraceId: "D-12345678" },
    update: {},
    create: {
      trackTraceId: "D-12345678",
      transportServiceId: "85ff6163-7b9s-497c-b767-bd211497718f",
      trackLenght: 8,
      trackOnlyNumbers: true,
      trackPrefix: "D",
      verificationCode: "orderid",
      trackSequence: "12345678",
      location: "Kwadestraat 149b, 8800 Roeselare, België",
    },
  });

  await prisma.track_Trace.upsert({
    where: { trackTraceId: "D-56781234" },
    update: {},
    create: {
      trackTraceId: "D-56781234",
      transportServiceId: "85ff6163-7b9s-497c-b767-bd211497718f",
      trackLenght: 8,
      trackOnlyNumbers: true,
      trackPrefix: "D",
      verificationCode: "orderid",
      trackSequence: "56781234",
      location: "Beverenstraat 23, 8540 Deerlijk, België",
    },
  });

  await prisma.track_Trace.upsert({
    where: { trackTraceId: "D-87654321" },
    update: {},
    create: {
      trackTraceId: "D-87654321",
      transportServiceId: "85ff6163-4e3c-497c-b767-bd211497718f",
      trackLenght: 8,
      trackOnlyNumbers: true,
      trackPrefix: "D",
      verificationCode: "postcode",
      trackSequence: "87654321",
      location: "Westfields 1410, 5688 HA Oirschot, Nederland",
    },
  });

  await prisma.order.upsert({
    where: { orderId: "1" },
    update: {},
    create: {
      orderId: "1",
      orderCountry: "Belgium",
      orderCity: "Menen",
      orderPostalCode: "8930",
      orderStreet: "Bruggestraat",
      orderAddressNumber: "8",
      orderDate: new Date("2020-02-14 15:57:27.000000"),
      status: "Delivery",
      transportId: "85ff6163-4e3c-497c-b767-bd211497718f",
      companyId: "85dd6163-4e3c-497c-b767-bd211497718f",
      packagingId: "1",
      trackTraceId: "D-87654321",
    },
  });

  await prisma.order.upsert({
    where: { orderId: "2" },
    update: {},
    create: {
      orderId: "2",
      orderCountry: "France",
      orderCity: "Paris",
      orderPostalCode: "9000",
      orderStreet: "RodeBaan",
      orderAddressNumber: "50",
      orderDate: new Date("2020-02-14 15:57:32.0000000"),
      status: "Delivery",
      transportId: "85ff6163-7b9s-497c-b767-bd211497718f",
      companyId: "85dd6163-4e3c-497c-b767-bd211497718f",
      packagingId: "2",
      trackTraceId: "D-12345678",
    },
  });
  await prisma.order.upsert({
    where: { orderId: "3" },
    update: {},
    create: {
      orderId: "3",
      orderCountry: "Germany",
      orderCity: "Berlin",
      orderPostalCode: "7000",
      orderStreet: "BerlinRoad",
      orderAddressNumber: "60",
      orderDate: new Date("2020-02-14 15:57:37.0000000"),
      status: "Delivery",
      transportId: "85ff6163-7b9s-654t-b767-bd211497718f",
      companyId: "85dd6163-4e3c-497c-b767-bd211497718f",
      packagingId: "3",
      trackTraceId: "D-56781234",
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });