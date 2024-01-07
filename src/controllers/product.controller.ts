import Product from "../models/product.model";
import { Request, Response } from "express";

// @desc Get all products
// @route GET /products
// @access Public
async function getAllProducts(req: Request, res: Response): Promise<void> {
  const products = await Product.find().lean();
  res.json(products);
}

// @desc Create new product
// @route POST /products
// @access Public
async function createProduct(req: Request, res: Response): Promise<void> {
  const {
    name,
    description,
    price,
    categoryId,
    images,
    stock,
    lowStockThreshold,
    brand,
    ratings,
    isActive,
  } = req.body;

  if (!name || !description || !price || !categoryId || !stock) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const duplicate = await Product.findOne({ name, categoryId })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    res.status(409).json({ message: "Duplicate product" });
    return;
  }

  const product = await Product.create({
    name,
    description,
    price,
    categoryId,
    images,
    stock,
    lowStockThreshold,
    brand,
    ratings,
    isActive,
  });

  if (product) {
    res.status(201).json({ message: "New product created" });
    return;
  } else {
    res.status(400).json({ message: "Invalid product data received" });
    return;
  }
}

// @desc Update a product
// @route PATCH /products
// @access Public
async function updateProduct(req: Request, res: Response): Promise<void> {
  const {
    id,
    name,
    description,
    price,
    categoryId,
    images,
    stock,
    lowStockThreshold,
    brand,
    ratings,
    isActive,
    order,
  } = req.body;

  if (
    !id ||
    !name ||
    !description ||
    !price ||
    !categoryId ||
    !stock ||
    !order ||
    typeof isActive !== "boolean" ||
    !Array.isArray(images)
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const duplicate = await Product.findOne({ name, categoryId })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate product" });
    return;
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.categoryId = categoryId;
  product.images = images;
  product.stock = stock;
  product.lowStockThreshold = lowStockThreshold;
  product.brand = brand;
  product.ratings = ratings;
  product.isActive = isActive;
  product.order = order;

  const updatedProduct = await product.save();

  res.json({ message: `${updatedProduct.name} updated` });
}

// @desc Delete a product
// @route DELETE /products
// @access Public
async function deleteProduct(req: Request, res: Response): Promise<void> {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Product ID Required" });
    return;
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  await product.deleteOne();

  const reply = `Name ${product.name} with ID ${product._id} deleted`;

  res.json(reply);
}

export { getAllProducts, createProduct, updateProduct, deleteProduct };
