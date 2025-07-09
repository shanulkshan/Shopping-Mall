import  Jwt  from "jsonwebtoken";
import { errorHandle } from "../utils/error.js";
import User from "../models/User.model.js";


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if(!token){
        return next(errorHandle(401, 'Unauthorized'));
    }
    Jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
   
        if(err) {
            return next( errorHandle(401, 'Unauthorized'));
        }
        req.user = user;
        next();
    });

};

export const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return next(errorHandle(404, 'User not found'));
        }

        if (user.role !== 'admin' && user.userType !== 'admin') {
            return next(errorHandle(403, 'Access denied. Admin privileges required.'));
        }

        next();
    } catch (error) {
        next(error);
    }
};