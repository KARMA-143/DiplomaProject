const APIError = require("../exceptions/APIError");

const checkIsMentorMiddleware = async (req, res, next) => {
    try{
        if(req.role==="member"){
            return next(new APIError(403, "Access denied"));
        }
        next();
    }
    catch(err){
        next(err);
    }
}

module.exports = checkIsMentorMiddleware;