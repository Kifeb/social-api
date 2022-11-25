import { Sequelize } from "sequelize";
import db from "../../config/db.mjs";

const {DataTypes} = Sequelize;

const AuthUser = db.define(users, {
    id: {
        type: DataTypes.INTEGER
    }
})
