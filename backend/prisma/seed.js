import prisma from "../src/prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  // Xóa dữ liệu cũ
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Tạo users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 10),
      phone: "0123456789",
      address: "123 Main St",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 10),
      phone: "0987654321",
      address: "456 Oak Ave",
    },
  });

  // Tạo products
  const products = [];

  // Product 1
  products.push(
    await prisma.product.create({
      data: {
        name: 'Pro Laptop 15"',
        description: "High-performance laptop with Intel Core i9, 16GB RAM, 512GB SSD",
        price: 1299.99,
        image: "https://placehold.co/300x300?text=Laptop+Pro",
        category: "computers",
        stock: 12,
        rating: 4.8,
      },
    })
  );

  // Product 2
  products.push(
    await prisma.product.create({
      data: {
        name: "Gaming Desktop PC",
        description: "Ultimate gaming PC with RTX 4090, Ryzen 9, 64GB RAM",
        price: 2499.99,
        image: "https://placehold.co/300x300?text=Gaming+PC",
        category: "computers",
        stock: 5,
        rating: 4.9,
      },
    })
  );

  // Product 3
  products.push(
    await prisma.product.create({
      data: {
        name: "Wireless Headphones Pro",
        description: "Premium noise-cancelling with 40-hour battery life",
        price: 349.99,
        image: "https://placehold.co/300x300?text=Headphones+Pro",
        category: "electronics",
        stock: 28,
        rating: 4.7,
      },
    })
  );

  // Product 4
  products.push(
    await prisma.product.create({
      data: {
        name: "Mechanical Keyboard RGB",
        description: "Cherry MX switches, programmable RGB, mechanical keyboard",
        price: 189.99,
        image: "https://placehold.co/300x300?text=Keyboard",
        category: "accessories",
        stock: 35,
        rating: 4.6,
      },
    })
  );

  // Product 5
  products.push(
    await prisma.product.create({
      data: {
        name: "Gaming Mouse Ultra",
        description: "16000 DPI, 8 programmable buttons, lightweight design",
        price: 79.99,
        image: "https://placehold.co/300x300?text=Gaming+Mouse",
        category: "accessories",
        stock: 55,
        rating: 4.5,
      },
    })
  );

  // Product 6
  products.push(
    await prisma.product.create({
      data: {
        name: "iPhone 15 Pro Max",
        description: "Latest Apple flagship with A17 Pro chip, 48MP camera",
        price: 1199.99,
        image: "https://placehold.co/300x300?text=iPhone+15+Pro",
        category: "phones",
        stock: 20,
        rating: 4.8,
      },
    })
  );

  // Product 7
  products.push(
    await prisma.product.create({
      data: {
        name: "Samsung Galaxy S24 Ultra",
        description: "Premium Android with 200MP camera and Snapdragon 8 Gen 3",
        price: 1299.99,
        image: "https://placehold.co/300x300?text=Galaxy+S24",
        category: "phones",
        stock: 18,
        rating: 4.7,
      },
    })
  );

  // Product 8
  products.push(
    await prisma.product.create({
      data: {
        name: '4K Wireless Monitor 27"',
        description: "4K UHD 60Hz, USB-C connectivity, HDR support",
        price: 599.99,
        image: "https://placehold.co/300x300?text=4K+Monitor",
        category: "electronics",
        stock: 8,
        rating: 4.6,
      },
    })
  );

  // Product 9
  products.push(
    await prisma.product.create({
      data: {
        name: "USB-C Hub 7-in-1",
        description: "HDMI, USB 3.0, SD card reader, PD charging up to 100W",
        price: 49.99,
        image: "https://placehold.co/300x300?text=USB+Hub",
        category: "accessories",
        stock: 60,
        rating: 4.4,
      },
    })
  );

  // Product 10
  products.push(
    await prisma.product.create({
      data: {
        name: "Portable SSD 2TB",
        description: "Ultra-fast NVMe, 1050MB/s, rugged design",
        price: 299.99,
        image: "https://placehold.co/300x300?text=Portable+SSD",
        category: "accessories",
        stock: 25,
        rating: 4.7,
      },
    })
  );

  // Product 11
  products.push(
    await prisma.product.create({
      data: {
        name: "Webcam 4K Pro",
        description: "4K 30fps, auto-focus, built-in mic, for streaming",
        price: 149.99,
        image: "https://placehold.co/300x300?text=4K+Webcam",
        category: "electronics",
        stock: 30,
        rating: 4.5,
      },
    })
  );

  // Product 12
  products.push(
    await prisma.product.create({
      data: {
        name: "Wireless Charging Pad",
        description: "15W fast charging, LED indicator, universal compatibility",
        price: 29.99,
        image: "https://placehold.co/300x300?text=Charging+Pad",
        category: "accessories",
        stock: 80,
        rating: 4.3,
      },
    })
  );

  // Product 13
  products.push(
    await prisma.product.create({
      data: {
        name: "Mechanical Laptop Stand",
        description: 'Adjustable height, aluminum alloy, supports up to 17"',
        price: 59.99,
        image: "https://placehold.co/300x300?text=Laptop+Stand",
        category: "accessories",
        stock: 45,
        rating: 4.4,
      },
    })
  );

  // Product 14
  products.push(
    await prisma.product.create({
      data: {
        name: "Portable Bluetooth Speaker",
        description: "20W stereo, 12-hour battery, waterproof IPX7",
        price: 99.99,
        image: "https://placehold.co/300x300?text=BT+Speaker",
        category: "electronics",
        stock: 40,
        rating: 4.6,
      },
    })
  );

  // Product 15
  products.push(
    await prisma.product.create({
      data: {
        name: "Smart USB Power Strip",
        description: "4 outlets, 4 USB ports, WiFi control, surge protection",
        price: 39.99,
        image: "https://placehold.co/300x300?text=Power+Strip",
        category: "accessories",
        stock: 50,
        rating: 4.2,
      },
    })
  );

  // Product 16
  products.push(
    await prisma.product.create({
      data: {
        name: 'Tablet iPad Air 11"',
        description: "M2 chip, 128GB storage, stunning Liquid Retina display",
        price: 899.99,
        image: "https://placehold.co/300x300?text=iPad+Air",
        category: "electronics",
        stock: 15,
        rating: 4.7,
      },
    })
  );

  // Product 17
  products.push(
    await prisma.product.create({
      data: {
        name: "Smartwatch Ultra",
        description: "AMOLED display, heart rate monitor, 7-day battery",
        price: 399.99,
        image: "https://placehold.co/300x300?text=Smartwatch",
        category: "electronics",
        stock: 22,
        rating: 4.5,
      },
    })
  );

  // Product 18
  products.push(
    await prisma.product.create({
      data: {
        name: "Air Purifier Smart",
        description: "HEPA filter, WiFi control, quiet 24dB operation",
        price: 199.99,
        image: "https://placehold.co/300x300?text=Air+Purifier",
        category: "electronics",
        stock: 10,
        rating: 4.4,
      },
    })
  );

  // Product 19
  products.push(
    await prisma.product.create({
      data: {
        name: "External Hard Drive 4TB",
        description: "Seagate Backup Plus, USB 3.0, compact design",
        price: 129.99,
        image: "https://placehold.co/300x300?text=HDD+4TB",
        category: "accessories",
        stock: 32,
        rating: 4.3,
      },
    })
  );

  // Product 20
  products.push(
    await prisma.product.create({
      data: {
        name: "Webcam Ring Light Stand",
        description: "3-color ring light, adjustable stand, dual smartphone clip",
        price: 79.99,
        image: "https://placehold.co/300x300?text=Ring+Light",
        category: "accessories",
        stock: 38,
        rating: 4.6,
      },
    })
  );

  // Tạo order
  const order = await prisma.order.create({
    data: {
      userId: user1.id,
      totalPrice: 1379.98,
      shippingAddress: "123 Main St",
      status: "shipped",
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: products[0].price,
          },
          {
            productId: products[4].id,
            quantity: 1,
            price: products[4].price,
          },
        ],
      },
    },
  });

  // Tạo reviews
  await prisma.review.create({
    data: {
      userId: user2.id,
      productId: products[0].id,
      rating: 5,
      comment: "Excellent laptop!",
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("Sample users:");
  console.log(`  Email: ${user1.email}, Password: password123`);
  console.log(`  Email: ${user2.email}, Password: password123`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
