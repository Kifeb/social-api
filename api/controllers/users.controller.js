import { db } from "../../config/db.mjs";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {
    const userId = req.params.userId;
    const query = "SELECT * FROM users WHERE id = ?"

    db.query(query, [userId], (err, data) => {
        if (err) return res.status(404).json(err);
        const {password, ...info } = data[0];
        
        return res.json(info)
    })
}

export const updateUsers = (req, res) => {
    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "UPDATE users SET `name`= ?,`city`= ?,`website`= ?,`profilePic`= ?,`coverPic`= ? WHERE id= ? ";

        // const values = [
        //     req.body.name,
        //     req.body.city,
        //     req.body.website,
        //     req.body.profilePic,
        //     req.body.coverPic,
        //     req.query.userId,
        // ]

        db.query(query, [
            req.body.name,
            req.body.city,
            req.body.website,
            req.body.profilePic,
            req.body.coverPic,
            userInfo.id,
        ], (err, data) => {
            if (err) res.status(500).json(err.message);
            if (data.affectedRows > 0) return res.json("Updated!");
            return res.status(403).json("You can update only your post!");
        })
    })
}