import User from "../models/user.model";
import { Request, Response } from "express";
import { hash } from "bcrypt";

// @desc Get all users
// @route GET /products
// @access Public
async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    res.status(400).json({ message: "No users found" });
    return;
  }

  res.json(users);
}

// @desc Create new user
// @route POST /users
// @access Public
async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, password, address } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (duplicate) {
    res.status(409).json({ message: "Duplicate email" });
    return;
  }

  const hashedPwd = await hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPwd,
    address,
  });

  if (user) {
    res.status(201).json({ message: `New user ${name} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
}

// @desc Update a user
// @route PATCH /users
// @access Public
async function updateUser(req: Request, res: Response): Promise<void> {
  const { id, name, email, password, address } = req.body;

  if (!id || !name || !email) {
    res
      .status(400)
      .json({ message: "All fields except password are required" });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate email" });
    return;
  }

  user.name = name;
  user.email = email;
  user.address = address;

  if (password) {
    user.password = await hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.name} updated` });
}

// @desc Delete a user
// @route DELETE /users
// @access Public
async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ message: "User ID Required" });
    return;
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  await user.deleteOne();

  const reply = `Email ${user.name} with ID ${user._id} deleted`;

  res.json(reply);
}

export { getAllUsers, createUser, updateUser, deleteUser };
