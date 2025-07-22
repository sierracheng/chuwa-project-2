import express, { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/UserControllers";

const router: Router = express.Router();

// TODO:
// 1. POST: Create a new user
router.post("/users", (req, res) => {
  createUser(req, res);
});

// 2. PUT: Update an existing user
router.put("/users/:id", (req, res) => {
  updateUser(req, res);
});

// 3. GET: Get an existing user
router.get("/users/:id", (req, res) => {
  getUser(req, res);
});

// 4. DELETE: Delete an exisiting user
router.delete("/users/:id", (req, res) => {
  deleteUser(req, res);
});

export default router;
