import express from "express";
import prisma from "../prisma.js";

const router = express.Router();

// GET /api/products - Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id - Lấy sản phẩm theo ID
router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products - Tạo sản phẩm (admin only)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock),
      },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id - Cập nhật sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
        category,
        stock: parseInt(stock),
      },
    });

    res.json(product);
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id - Xóa sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products - với pagination & filter
router.get("/", async (req, res) => {
  try {
    //LẤY CÁC PARAMS TỪ QUERY STRING
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;
    const minRating = parseFloat(req.query.rating) || 0;
    const sortBy = req.query.sortBy || "newest";

    let filter = {};

    // Tìm kiếm theo
    if (keyword) {
      filter.name = { $regex: keyword, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    filter.price = { $gte: minPrice, $lte: maxPrice };

    if (minRating > 0) {
      filter.rating = { $gte: minRating };
    }

    let sortObj = {};
    switch (sortBy) {
      case "price-asc":
        sortObj = { price: 1 };
        break;
      case "price-desc":
        sortObj = { price: -1 };
        break;
      case "name-asc":
        sortObj = { name: 1 };
        break;
      case "name-desc":
        sortObj = { name: -1 };
        break;
      case "popular":
        sortObj = { rating: -1, reviews: -1 }; // Sắp xếp theo rating cao nhất
        break;
      case "newest":
      default:
        sortObj = { createdAt: -1 }; // Mới nhất trước
        break;
    }

    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sortObj).skip(skip).limit(limit);
    const pages = Math.ceil(total / limit);

    if (page > pages && total > 0) {
      return res.status(400).json({
        success: false,
        Message: `Page ${page} does not exist. Total ${pages} pages.`,
      });
    }

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          pages,
          hasNextPage: page < pages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
