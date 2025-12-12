import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import prisma from "../prisma.js";

const router = express.Router();

// POST /api/orders - Tạo order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // Kiểm tra các product tồn tại và có đủ stock
    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.productId} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });
      }

      totalPrice += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Transaction: Tạo order + giảm stock
    const order = await prisma.$transaction(async (tx) => {
      // Tạo order
      const newOrder = await tx.order.create({
        data: {
          userId: req.userId,
          totalPrice,
          shippingAddress,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      // Giảm stock từng product
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders - Lấy đơn hàng của user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id - Lấy chi tiết order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Kiểm tra quyền truy cập
    if (order.userId !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
