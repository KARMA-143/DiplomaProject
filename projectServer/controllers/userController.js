const userService = require('../services/userService');


class UserController {
    async login(req, res, next){
        try{
            const { email, password } = req.body;
            const user=await userService.login({email,password});
            res.cookie('refresh_token', user.refreshToken, {
                httpOnly: true,
                maxAge:30*24*60*60*1000
            });
            user.refreshToken = null;
            return res.status(201).json(user);
        }
        catch(err){
            next(err);
        }

    }

    async register(req, res, next){
        try{
            const { email, password, name } = req.body;
            const newUser=await userService.register({email, password, name});
            res.cookie('refresh_token', newUser.refreshToken, {
                httpOnly: true,
                maxAge:30*24*60*60*1000
            });
            newUser.refreshToken = null;
            return res.status(201).json(newUser);
        }
        catch(err){
            next(err);
        }
    }

    async refresh(req, res, next){
        try{
            const token = req.cookies['refresh_token'];
            const userData = await userService.refreshToken(token);
            res.cookie('refresh_token', userData.refreshToken, {
                httpOnly: true,
                maxAge:30*24*60*60*1000
            });
            userData.refreshToken = null;
            return res.json(userData);
        }
        catch(err){
            next(err);
        }
    }

    async logout(req, res, next){
        try{
            const token = req.cookies['refresh_token'];
            await userService.logout(token);
            res.cookie('refresh_token', null,{
                httpOnly: true,
                maxAge:0
            });
            return res.status(200).send();
        }
        catch (err){
            next(err);
        }
    }

    async activate(req, res, next){
        try{
            const link=req.params.link;
            await userService.activateUser(link);
            return res.redirect(process.env.CLIENT_URL);
        }
        catch(err){
            next(err);
        }
    }

    async resendActivationLink(req, res, next){
        try{
            const user=req.user;
            await userService.resendActivationLink(user);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }

    async findUsersWithPattern(req, res, next){
        try{
            const pattern=req.params.pattern;
            const id = req.params.id;
            const users = await userService.findUsersWithPattern(pattern, id);
            return res.status(200).send(users);
        }
        catch(err){
            next(err);
        }
    }

    async changeUserName(req, res, next){
        try{
            const user=req.user;
            const body=req.body;
            await userService.changeUserName(user.id, body.name);
            return res.status(200).send();
        }
        catch(err){
            next(err);
        }
    }
}

module.exports = new UserController();