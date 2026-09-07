import { Router } from "express";

export const router = Router();

// Read users
router.get("/", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// Create user
router.post("/", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/:id", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/:id", (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});
