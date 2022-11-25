import {db} from "../../config/db.mjs";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {

    const query = "SELECT userId FROM likes WHERE postId = ?";

    db.query(query, [req.query.postId] ,(err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.userId));
    })
}

export const addLike = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "INSERT INTO likes(`userId`, `postId`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.postId
          ];
      

        db.query(query, [values] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been liked");
        })
    })

}

export const deleteLike = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token,"secretKey", (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";


        db.query(query, [userInfo.id, req.query.postId] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("like has been deleted");
        })
    })

}