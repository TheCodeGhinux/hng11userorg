"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.ConflictError = exports.UnprocessableEntityError = exports.MethodNotAllowedError = exports.InternalServerError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.CustomError = void 0;
class CustomError extends Error {
    statusCode;
    constructor(name, message, statusCode) {
        super(message);
        this.name = name;
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
function createCustomError(name, statusCode = 500) {
    return class extends CustomError {
        constructor(message) {
            super(name, message, statusCode);
        }
    };
}
const NotFoundError = createCustomError("NotFound Error", 404);
exports.NotFoundError = NotFoundError;
const BadRequestError = createCustomError("BadRequest Error", 400);
exports.BadRequestError = BadRequestError;
const UnauthorizedError = createCustomError("Unauthorized Error", 401);
exports.UnauthorizedError = UnauthorizedError;
const ForbiddenError = createCustomError("Forbidden Error", 403);
exports.ForbiddenError = ForbiddenError;
const InternalServerError = createCustomError("Internal ServerError", 500);
exports.InternalServerError = InternalServerError;
const MethodNotAllowedError = createCustomError("MethodNotAllowed Error", 405);
exports.MethodNotAllowedError = MethodNotAllowedError;
const ConflictError = createCustomError("Conflict Error", 409);
exports.ConflictError = ConflictError;
const UnprocessableEntityError = createCustomError("Unprocessable Content Error", 422);
exports.UnprocessableEntityError = UnprocessableEntityError;
const errorHandler = (err, req, res, next) => {
    console.error("An error occurred:", err);
    if (res.headersSent) {
        return next(err);
    }
    const errorResponse = {
        timestamp: new Date().toISOString(),
        status: err.statusCode || 500,
        error: err.name || "Internal Server Error",
        message: err.message || "Something went wrong",
        path: req.path,
        success: false,
    };
    res.status(errorResponse.status).json(errorResponse);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorhandler.js.map