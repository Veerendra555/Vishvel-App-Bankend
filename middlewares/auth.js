const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        // req.query.userid = req.user._id;
        next();
    }
    catch (error) {
        return res.status(401).json({ code: 401, msg: "Authorization failed. Please login again." });
    }
};