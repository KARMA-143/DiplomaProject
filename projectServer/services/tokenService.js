const jwt = require('jsonwebtoken');
const {RefreshToken} = require("../models/models");
require('dotenv').config();

class TokenService {
    async createToken(payload) {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '30m'});
        const refreshToken=jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET_KEY, {expiresIn: '30d'});
        return {accessToken, refreshToken};
    }

    async saveToken(userId, refreshToken, transaction){
        const token=await RefreshToken.findOne({where:{UserId:userId}});
        if(token){
            token.refreshToken = refreshToken;
            await token.save({transaction});
            return token;
        }
        return await RefreshToken.create({refreshToken: refreshToken, UserId: userId},{transaction});
    }

    validateAccessToken(token){
        try{
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        }
        catch(err){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
        }
        catch(err){
            return null;
        }
    }

    async findRefreshToken(token){
        return await RefreshToken.findOne({where:{refreshToken:token}});
    }

    async deleteRefreshToken(userId, transaction){
        await RefreshToken.destroy({where:{UserId:userId}, transaction});
    }
}

module.exports = new TokenService();