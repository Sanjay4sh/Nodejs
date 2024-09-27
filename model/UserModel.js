import mongoose from "mongoose";
import "../database/config.js";


const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require:true,
        },
        password: {
            type: String,
            require:true
        },
        email: {
            type: String,
            require:true,
            unique: true 
        },
        token: {
            type: String,
            require:false

        }
    }, 
    {timestamps: true}
)

const UserModel = mongoose.model('User',UserSchema);
export default UserModel;