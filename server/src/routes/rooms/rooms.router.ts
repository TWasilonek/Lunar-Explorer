import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // implementation for getting all rooms
});

router.get("/:id", (req, res) => {
  // implementation for getting a specific room
});

router.post("", (req, res) => {
  // implementation for creating a new room
});

router.put("/:id", (req, res) => {
  // implementation for updating room data
});

router.delete("/:id", (req, res) => {
  // implementation for deleting room data
});

export default router;
