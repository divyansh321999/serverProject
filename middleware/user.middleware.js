import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

const userMiddleware = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No token provided',
            isLoggedIn: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
                isLoggedIn: false
            });
        }

        req.user = user._doc;
        next(); 

    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
                isLoggedIn: false
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
                isLoggedIn: false
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                isLoggedIn: false
            });
        }
    }
};

export default userMiddleware;
