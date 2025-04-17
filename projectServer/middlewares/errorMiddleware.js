const APIError = require('../exceptions/APIError');

module.exports = function (err, req, res, next) {
    console.log(err);
    if(err instanceof APIError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }
    return res.status(500).json({message: "Some error occurred"});
}