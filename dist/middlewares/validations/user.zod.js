"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAwardDataSchema = exports.LoginUserDataSchema = exports.CreateUserDataSchema = void 0;
exports.validateCreateUserData = validateCreateUserData;
exports.validateUpdateUserData = validateUpdateUserData;
const zod_1 = require("zod");
const zod_error_1 = require("zod-error");
const uuid_1 = require("uuid");
const errorhandler_1 = require("../errorhandler");
const zod_validation_error_1 = require("zod-validation-error");
// import { ValidationError as ZodValidationError } from 'zod-validation-error'
const emailRegex = new RegExp(
// Local part
'^[a-zA-Z0-9._%+-]+@' +
    // Domain name
    '([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})$');
const charRegex = /^[a-zA-Z0-9\s]+$/;
exports.CreateUserDataSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(3).regex(charRegex, {
        message: 'first name cannot contain special characters',
    }),
    lastName: zod_1.z.string().min(3).regex(charRegex, {
        message: 'last name cannot contain special characters',
    }),
    email: zod_1.z
        .string()
        .min(3)
        .regex(emailRegex, { message: 'Invlaid email entered' }),
    password: zod_1.z
        .string()
        .min(7, { message: 'field cannot be empty' }),
    phone: zod_1.z
        .string()
        .min(9, { message: 'field cannot be empty' }),
    // userId: z
    //   .string()
    //   .min(3)
    //   .refine((value) => isUUID(value), {
    //     message: 'userId has to be a valid UUID',
    //   }),
});
exports.LoginUserDataSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(3)
        .regex(emailRegex, { message: 'Invlaid email entered' }),
    password: zod_1.z.string().min(7, { message: 'field cannot be empty' }),
});
exports.UpdateAwardDataSchema = zod_1.z.object({
    title: zod_1.z.string(),
    year: zod_1.z.string(),
    presented_by: zod_1.z.string(),
    url: zod_1.z.string().optional(),
    userId: zod_1.z.string().refine((value) => (0, uuid_1.validate)(value), {
        message: 'userId has to be a valid UUID',
    }),
});
// Custom function to validate date strings in "yyyy" format
function validateDateYYYY(dateString) {
    const datePattern = /^\d{4}$/;
    return datePattern.test(dateString);
}
const options = {
    delimiter: {
        error: ' 🔥 ',
    },
    transform: ({ errorMessage, index }) => `Error #${index + 1}: ${errorMessage}`,
};
const data = [
    {
        validation: 'regex',
        code: 'invalid_string',
        message: 'Invlaid email entered',
        path: ['email'],
    },
];
const result = exports.CreateUserDataSchema.safeParse(data);
async function validateCreateUserData(req, res, next) {
    try {
        const data = req.body;
        // Retrieve the "userId" from request parameters
        const userId = req.params.userId;
        // Validate the rest of the data against the schema
        // const result = await parseAsync(CreateUserDataSchema, {
        //   ...data,
        //   userId,
        //   options,
        // })
        exports.CreateUserDataSchema.parse(data);
        /// Store the validated data in the request object if needed
        // const validatedData = result
        // console.log(validatedData)
        // next()
    }
    catch (error) {
        const validationError = (0, zod_validation_error_1.fromError)(error);
        // the error is now readable by the user
        // you may print it to console
        console.log(validationError.toString());
        // const err = new BadRequestError(error.message)
        // return res.status(400).json({
        //   success: false,
        //   message: error.message,
        // })
        //  let message = 'Invalid input'
        const errorMessage = error.message.split(':').pop().trim();
        // console.log(errorMessage)
        next(new errorhandler_1.BadRequestError(errorMessage));
    }
}
async function validateUpdateUserData(req, res, next) {
    try {
        const data = req.body;
        // Validate date strings in "yyyy" format
        if (data.year && !validateDateYYYY(data.year)) {
            const err = new errorhandler_1.BadRequestError("Invalid 'year' date format, it must be 'yyyy'");
            return res.status(err.statusCode).json({ error: err.message });
        }
        // Validate the data against the schema
        const result = await (0, zod_error_1.parseAsync)(exports.UpdateAwardDataSchema, data, options);
        const validatedData = result;
        console.log(validatedData);
        next();
    }
    catch (error) {
        const err = new errorhandler_1.BadRequestError(error.message);
        console.error(err.message);
        res.status(err.statusCode).json({ error: err.message });
    }
}
//# sourceMappingURL=user.zod.js.map