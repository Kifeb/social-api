import { db } from "../../config/db.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    // Check user if exists
    const query = "SELECT * FROM users WHERE username = ?"

    db.query(query, [req.body.username], (err, data) => {
        
        if(err) return res.status(500).json(err);
        if(data.length) return res.status(409).json({msg: "User already exist"});
        
        //Create User and HASH
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt); 
        
        const queryInsert = "INSERT INTO users (`username`, `email`, `password`,`name`) VALUE (?)";

        const datas = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
        ];

        db.query(queryInsert, [datas], (err, data) => {
            if(err) return res.status(500).json({msg: err.message});
            return res.status(200).json({msg: "User has been created", data})
        })
    });
};


export const login = (req, res) => {
    
    // Check user if exists
    const query = "SELECT * FROM users WHERE username = ?"

    db.query(query, [req.body.username], (err, data) => {
        if(err) return res.status(500).json(err);
        if(data.length === 0) return res.status(404).json({msg: "User not found"});

        //Compare password
        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);

        if (!checkPassword) return res.status(400).json({msg: "Wrong password or username"});

        const token = jwt.sign({id: data[0].id}, "secretKey");

        const {password, ...other } = data[0];

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(other)

    })
};


export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json({msg: "user has been logout!"})
};
