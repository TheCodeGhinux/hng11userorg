"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    static success(res, data, statusCode = 200, message) {
        const responseObject = {
            timestamp: new Date().toISOString(),
            success: "success",
            status: statusCode,
            message: message,
        };
        if (message) {
            responseObject.message = message;
        }
        if (data !== null && data !== undefined) {
            responseObject.data = data;
        }
        res.status(statusCode).json(responseObject);
    }
}
exports.ResponseHandler = ResponseHandler;
//# sourceMappingURL=responsehandler.js.map