import  Jwt  from "jsonwebtoken";
import { errorHandle } from "../utils/error.js";
import User from "../models/User.model.js";


export const verifyToken = (req, res, next) => {
    console.log('VerifyToken called');
    console.log('Cookies:', req.cookies);
    console.log('Headers authorization:', req.headers.authorization);
    
    const token = req.cookies.access_token;

    if(!token){
        console.log('No token found in cookies');
        return next(errorHandle(401, 'Unauthorized'));
    }
    
    console.log('Token found, verifying...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    Jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
        if(err) {
            console.log('JWT verification error:', err);
            return next( errorHandle(401, 'Unauthorized'));
        }
        console.log('JWT verified successfully, user:', user);
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