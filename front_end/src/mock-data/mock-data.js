const PRODUCTS = [
  {
    id: 1,
    name: "Product 1",
    company: "Company 1",
    price: 100,
    description: "Product 1 description",
    image: "https://picsum.photos/1000/1000",
    stock: 10,
  },
  {
    id: 2,
    name: "Product 2",
    company: "Company 2",
    price: 200,
    description: "Product 2 description",
    image: "https://picsum.photos/1000/1000",
    stock: 20,
  },
  {
    id: 3,
    name: "Product 3",
    company: "Company 2",
    price: 300,
    description: "Product 3 description",
    image: "https://picsum.photos/1000/1000",
    stock: 30,
  },
  {
    id: 4,
    name: "Product 3",
    company: "Company 3",
    price: 700,
    description: "Product 3 description",
    image: "https://picsum.photos/1000/1000",
    stock: 399.99,
  },
  {
    id: 5,
    name: "Product 4",
    company: "Company 4",
    price: 499.47,
    description: "Product 4 description",
    image: "https://picsum.photos/1000/1000",
    stock: 5,
  },

];

const NOTIFICATIONS = [
  {
    notificationId: 1,
    contentsShort: "Information about notification 1",
    contents: "Information about notification 1 expanded",
    dateCreated: "2023-03-01",
    seen: false,
  },
  {
    notificationId: 2,
    contentsShort: "Information about notification 2",
    contents: "Information about notification 2 expanded",
    dateCreated: "2023-03-02",
    seen: false,
  },
  {
    notificationId: 3,
    contentsShort: "Information about notification 3",
    contents: "Information about notification 3 expanded",
    dateCreated: "2023-03-09",
    seen: false,
  },
];

module.exports = {
  PRODUCTS,
  NOTIFICATIONS,
};
