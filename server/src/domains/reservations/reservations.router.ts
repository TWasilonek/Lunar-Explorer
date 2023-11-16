import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  // implementation for getting all reservations
});

router.get("/:id", (req, res) => {
  // implementation for getting a specific reservation
});

router.post("", (req, res) => {
  // implementation for creating a new reservation
});

router.delete("/:id", (req, res) => {
  // implementation for deleting a reservation
});

export default router;
