"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const zod_1 = require("zod");
const errorhandler_1 = require("./errorhandler");
const validationMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const validationError = mapZodErrorToValidationError(error);
                next(new errorhandler_1.BadRequestError(validationError));
            }
            else {
                next(error);
            }
        }
    };
};
exports.validationMiddleware = validationMiddleware;
// Utility function to map ZodError to a more readable validation error
const mapZodErrorToValidationError = (error) => {
    const issues = error.issues.map(mapZodIssue);
    const issuesCount = issues.length;
    const issuesMessage = issues
        .map((issue, index) => `Issue ${index + 1}: ${issue.message} in ${issue.path}`)
        .join(", ");
    return `validationError: "issues": ${issuesCount}, ${issuesMessage}`;
};
// Utility function to map ZodIssue to a more readable format
const mapZodIssue = (issue) => {
    return {
        message: issue.message,
        path: issue.path.join("."),
    };
};
//# sourceMappingURL=validationMiddleware.js.map