import express  from "express";
import { getUsers, updateUsers } from "../controllers/users.controller.js";

const router = express.Router();

router.get("/find/:userId", getUsers)
router.put("/", updateUsers)


export default router;