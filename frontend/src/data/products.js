export const products = [
  {
    id: 1,
    name: "Laptop Dell XPS 13",
    price: 1200,
    image: "https://picsum.photos/300/200?random=1",
    description: "Powerful, lightweight and portable laptop",
    details: "Intel Core i7, 16GB RAM, 512GB SSD, 13.3 inch FHD display",
    stock: 15,
    category: "Electronics",
  },
  {
    id: 2,
    name: "iPhone 14 Pro",
    price: 999,
    image: "https://picsum.photos/300/200?random=2",
    description: "Flagship smartphone with Pro camera",
    details: "A16 Bionic chip, 6GB RAM, 256GB storage, 6.1 inch display",
    stock: 20,
    category: "Electronics",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4 Headphones",
    price: 349,
    image: "https://picsum.photos/300/200?random=3",
    description: "World's leading noise-canceling headphones",
    details:
      "Active noise cancellation, 30-hour battery life, crystal clear sound",
    stock: 30,
    category: "Audio",
  },
  {
    id: 4,
    name: "Logitech MX Master 3S Mouse",
    price: 99,
    image: "https://picsum.photos/300/200?random=4",
    description: "Professional wireless mouse",
    details: "Bluetooth/USB connection, 70-day battery life, high precision",
    stock: 50,
    category: "Accessories",
  },
  {
    id: 5,
    name: "Mechanical RGB Keyboard",
    price: 150,
    image: "https://picsum.photos/300/200?random=5",
    description: "Mechanical keyboard with RGB lighting",
    details: "Cherry MX switches, full-size keyboard, programmable",
    stock: 25,
    category: "Accessories",
  },
  {
    id: 6,
    name: "LG 27 inch 4K Monitor",
    price: 499,
    image: "https://picsum.photos/300/200?random=6",
    description: "Ultra sharp 4K display, 60Hz refresh rate",
    details: "27 inch, 3840x2160 resolution, USB-C, HDR10 support",
    stock: 10,
    category: "Electronics",
  },
];

export const getProductById = (id) => {
  return products.find((product) => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  return products.filter((product) => product.category === category);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return products.filter((product) =>
    product.name.toLowerCase().includes(lowerQuery)
  );
};
