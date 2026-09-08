import { Router } from "express";
import { supabase } from "../../config/supabase.js";

export const router = Router();

const PG_SELECT = "id, username, email, role, created_at, updated_at";

// Read users
router.get("/pg", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("users").select(PG_SELECT);
    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Create user
router.post("/pg", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "username, email, password and role are required!" });
    }

    const newUser = { username, email, password, role };

    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select(PG_SELECT);

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Update user
router.put("/pg/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        error: "username, email and password and role are required!!!",
      });
    }

    const updatedUser = { username, email, password, role };

    const { data, error } = await supabase
      .from("users")
      .update([updatedUser])
      .eq("id", id)
      .select(PG_SELECT);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete("/pg/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id)
      .select(PG_SELECT);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: `User with ID ${id} not found` });
    }

    return res.status(201).json({ success: true, deletedData: data });
  } catch (error) {
    next(error);
  }
});
