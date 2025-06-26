const AccessService = require('../services/access.service');
const {OK, Created} = require('../res/success.response');

// controller take the request and response
// and call the service to do the actual work
// then return the response to the client
class AcessController {
    signUp = async (req, res, next) => {
        new Created({
            message: 'User created successfully',
            metadata: await AccessService.signup(req.body)
        }).send(res);
    }

    signin = async (req, res, next)=>{
            const refreshToken = await req.headers['refresh_token']
            // console.log("can i get rt:",refreshToken)
            new OK ({
                message: 'Login successfully',
                metadata: await AccessService.signin(req.body,refreshToken)
            }).send(res)
    }

    signout = async (req, res, next) =>{
        new OK ({
            message: 'youre banned',
            metadata: await AccessService.signout(req.keyStore)
        }).send(res)
    }
}

module.exports = new AcessController();

