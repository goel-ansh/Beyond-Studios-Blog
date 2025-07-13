import jwt from "jsonwebtoken";

const auth = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    console.log('Auth middleware - Authorization header:', authHeader);

    try {
        if (!authHeader) {
            console.log('Auth middleware - No authorization header provided');
            return res.json({success: false, message: "No token provided"});
        }

        // Support both "Bearer token" and just "token" formats
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        console.log('Auth middleware - Extracted token:', token ? 'Token exists' : 'No token');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Decoded token:', decoded);
        
        // Check for legacy admin ID and reject it
        if (decoded.id === 'legacy-admin-id') {
            console.log('Auth middleware - Detected legacy admin ID, rejecting token');
            return res.json({success: false, message: "Invalid token - please login again"});
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.log('Auth middleware - JWT verification error:', error.message);
        res.json({success: false, message: "Invalid token"})
    }
}

// Middleware to check specific roles
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.json({success: false, message: "Authentication required"});
        }
        
        if (!roles.includes(req.user.role)) {
            return res.json({success: false, message: "Access denied. Insufficient permissions"});
        }
        
        next();
    };
};

export default auth;