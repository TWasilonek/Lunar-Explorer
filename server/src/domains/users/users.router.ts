import express from "express";

const router = express.Router();

router.get("/me", (req, res) => {
  // implementation for getting user data
});

router.post("/", (req, res) => {
  // implementation for creating a new user
});

router.put("/me", (req, res) => {
  // implementation for updating user data
});

router.delete("/me", (req, res) => {
  // implementation for deleting user data
});

export default router;
