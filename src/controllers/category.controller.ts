import Category from "../models/category.model";
import Product from "../models/product.model";
import { Request, Response } from "express";

// @desc Get all categories
// @route GET /categories
// @access Public
async function getAllCategories(req: Request, res: Response): Promise<void> {
  const categories = await Category.find().lean();
  res.json(categories);
}

// @desc Create new category
// @route POST /categories
// @access Public
async function createCategory(req: Request, res: Response): Promise<void> {
  const {
    name,
    description,
    parentCategoryId,
    icon,
    metaTitle,
    metaDescription,
    metaKeywords,
    isActive,
    isVisible,
    slug,
  } = req.body;

  if (!name || !description || !slug) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const duplicateName = await Category.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  const duplicateRelation = await Category.findOne({ parentCategoryId })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  const duplicateSlug = await Category.findOne({ slug })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicateName) {
    res.status(409).json({ message: "Duplicate category name" });
    return;
  } else if (duplicateRelation && duplicateSlug) {
    res.status(409).json({ message: "Duplicate category" });
    return;
  }

  const category = await Category.create({
    name,
    description,
    parentCategoryId,
    icon,
    metaTitle,
    metaDescription,
    metaKeywords,
    isActive,
    isVisible,
    slug,
  });

  if (category) {
    res.status(201).json({ message: "New category created" });
    return;
  } else {
    res.status(400).json({ message: "Invalid category data received" });
    return;
  }
}

// @desc Update a category
// @route PATCH /categories
// @access Public
async function updateCategory(req: Request, res: Response): Promise<void> {
  const {
    id,
    name,
    description,
    parentCategoryId,
    icon,
    metaTitle,
    metaDescription,
    metaKeywords,
    isActive,
    isVisible,
    slug,
    order,
  } = req.body;

  if (
    !id ||
    !name ||
    !description ||
    !slug ||
    typeof isActive !== "boolean" ||
    typeof isVisible !== "boolean" ||
    !Array.isArray(metaKeywords) ||
    !order
  ) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const category = await Category.findById(id).exec();

  if (!category) {
    res.status(400).json({ message: "Category not found" });
    return;
  }

  const duplicateName = await Category.findOne({ name })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  const duplicateRelation = await Category.findOne({ parentCategoryId })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  const duplicateSlug = await Category.findOne({ slug })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicateName && duplicateName._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate category name" });
    return;
  } else if (
    duplicateRelation &&
    duplicateRelation._id.toString() !== id &&
    duplicateSlug &&
    duplicateSlug._id.toString() !== id
  ) {
    res.status(409).json({ message: "Duplicate category" });
    return;
  }

  category.name = name;
  category.description = description;
  category.slug = slug;
  category.icon = icon;
  category.metaTitle = metaTitle;
  category.metaDescription = metaDescription;
  category.metaKeywords = metaKeywords;
  category.isActive = isActive;
  category.isVisible = isVisible;
  category.order = order;

  if (parentCategoryId !== category.id) {
    category.parentCategoryId = parentCategoryId;
  }

  const updatedCategory = await category.save();

  res.json({ message: `${updatedCategory.name} updated` });
}

// @desc Delete a category
// @route DELETE /categories
// @access Public
async function deleteCategory(req: Request, res: Response): Promise<void> {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "Category ID Required" });
    return;
  }

  const product = await Product.findOne({ categoryId: id }).lean().exec();
  if (product) {
    res.status(400).json({ message: "Category has assigned products" });
    return;
  }

  const category = await Category.findById(id).exec();

  if (!category) {
    res.status(400).json({ message: "Category not found" });
    return;
  }

  await category.deleteOne();

  const reply = `Name ${category.name} with ID ${category._id} deleted`;

  res.json(reply);
}

export { getAllCategories, createCategory, updateCategory, deleteCategory };
