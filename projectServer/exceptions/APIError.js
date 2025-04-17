module.exports = class APIError extends Error {
    status;
    errors;

    constructor(status, message, errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new APIError(401, "User unauthorized");
    }

    static BadRequestError(message, errors=[]) {
        return new APIError(400, message, errors);
    }
}