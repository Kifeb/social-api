import {db} from "../../config/db.mjs";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {

    const query = "SELECT followersUserId FROM relationship WHERE followedUserId = ?";

    db.query(query, [req.query.followedUserId] ,(err, data) => {
        if (err) return res.status(500).json(err.message);
        return res.status(200).json(data.map(relationship=>relationship.followersUserId));
    })
}

export const addRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "INSERT INTO relationship(`followersUserId`, `followedUserId`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.userId
          ];

        db.query(query, [values] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Following");
        })
    })

}

export const deleteRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    if(!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.SECRET_KEY, (err, userInfo) => {
        if (err) return res.status(403).json("Invalid Token");

        const query = "DELETE FROM relationship WHERE `followersUserId` = ? AND `followedUserId` = ?";


        db.query(query, [userInfo.id, req.query.userId] ,(err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Unfollow");
        })
    })

}