import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // implementation for getting all spaceships
});

router.get("/:id", (req, res) => {
  // implementation for getting a specific spaceship
});

router.post("/", (req, res) => {
  // implementation for creating a new spaceship
});

router.put("/:id", (req, res) => {
  // implementation for updating spaceship data
});

router.delete("/:id", (req, res) => {
  // implementation for deleting spaceship data
});

export default router;
