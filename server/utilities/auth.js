const db = require("../db/index.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports =  {
    createUser: async data => {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 12);
            const result = await db.createUser(data.email, hashedPassword, data.name);
            return result;
        } catch(error) {
            throw error;
        }
    },
    verifyUser: async email => {
        try {
            const result = await db.updateUserVerificationStatus(email);
            return result;
        } catch(err) {
            throw err;
        }
    },
    authenticateUser: async (email, password) => {
        try {
            const result = db.checkUser(email, password);
            return result;
        } catch(err) {
            throw err;
        }
    },
    requireAuthentication: (req, res, next) => {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if(err) {
                if(err.name === "TokenExpiredError") {
                    return res.json({
                        status: "warning",
                        title: "Timeout",
                        info: "Token expired, please login again"
                    });
                } else if(err.name === "JsonWebTokenError") {
                    return res.json({
                        status: "error",
                        title: "Authentication error",
                        info: "User is not logged in"
                    });
                }
            } else {
                res.locals.userid = decoded.data.userid;
                res.locals.email = decoded.data.email;
                res.locals.name = decoded.data.name;
                next();
            }
        });
    },
    requireAdminAuthentication: (req, res, next) => {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.ADMIN_ACCESS_KEY, (err, decoded) => {
            if(err) {
                if(err.name === "TokenExpiredError") {
                    return res.json({
                        status: "warning",
                        title: "Timeout",
                        info: "Token expired, please login again"
                    });
                } else if(err.name === "JsonWebTokenError") {
                    return res.json({
                        status: "error",
                        title: "Authentication error",
                        info: "Admin is not logged in"
                    });
                } 
            }
            else {
                next();
            }
        });
    }
}