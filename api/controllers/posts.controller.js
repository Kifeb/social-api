import jwt from "jsonwebtoken";
import moment from "moment";
import {db} from "../../config/db.mjs"

export const getPosts = (req, res) => {
    
    const userId = req.query.userId
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = userId != "undefined"
        ? "SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE userId = ? ORDER BY p.createdAt DESC"
        : "SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationship AS r ON (p.userId = r.followedUserId) WHERE r.followersUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC";

        const values = userId != "undefined" ? [userId] : [userInfo.id, userInfo.id]

        db.query(query, values, (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        })
    })

}

export const addPost = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "INSERT INTO posts(`desc`, `img`, `createdAt`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(query, [values] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been Created");
        })
    })

}

export const deletePost = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

        db.query(query, [req.params.id, userInfo.id] ,(err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows > 0) return res.status(200).json("deleted");
            return res.status(403).json("You can delete only your post");
        })
    })

}