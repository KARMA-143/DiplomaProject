const tokenService = require("../services/tokenService");
const APIError = require("../exceptions/APIError");

const authMiddleware = (req, res, next) => {
    try{
        const authorizationHeader = req.headers.authorization;
        if(!authorizationHeader){
            return next(APIError.UnauthorizedError());

        }
        const accessToken = authorizationHeader.split(' ')[1];
        if(!accessToken){
            return next(APIError.UnauthorizedError());
        }
        const userData=tokenService.validateAccessToken(accessToken);
        if(!userData){
            return next(APIError.UnauthorizedError());
        }
        req.user=userData;
        next();
    }
    catch(err){
        return next(err);
    }
}

module.exports = authMiddleware;