import express  from "express";
import { addComment, getComments } from "../controllers/comments.controller.js";


const router = express.Router();

router.get("/", getComments)
router.post("/", addComment)


export default router;