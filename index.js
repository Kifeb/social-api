import express from "express";
import cors from "cors"
import multer from "multer"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import userRoutes from "./api/routes/users.routes.js";
import postRoutes from "./api/routes/posts.routes.js";
import likeRoutes from "./api/routes/likes.routes.js";
import commentRoutes from "./api/routes/comments.routes.js";
import authRoutes from "./api/routes/auth.routes.js";
import relationshipRoutes from "./api/routes/relationship.routes.js";
import dotenv from "dotenv"

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewere
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Credentials", true);
	next();
  });
app.use(cors({
	origin: "*",
}));
app.use(cookieParser())
app.use(bodyParser.json())

//Upload foto
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, "../client/public/upload");
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + file.originalname);
	},
  });
  
  const upload = multer({ storage: storage });

  app.post("/api/upload", upload.single("file"), (req, res) => {
	const file = req.file;
	res.status(200).json(file.filename)
  })

//Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/relationships", relationshipRoutes)

app.listen(PORT, () => console.log("API Connected"))
