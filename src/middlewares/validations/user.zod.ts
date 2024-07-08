import { ZodError, z } from 'zod'
import { NextFunction, Request, Response } from 'express'
import {
  parseAsync,
  generateErrorMessage,
  ErrorMessageOptions,
} from 'zod-error'
import { validate as isUUID } from 'uuid'
import { BadRequestError } from '../errorhandler'
import { fromError } from 'zod-validation-error'
// import { ValidationError as ZodValidationError } from 'zod-validation-error'

const emailRegex = new RegExp(
  // Local part
  '^[a-zA-Z0-9._%+-]+@' +
    // Domain name
    '([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})$'
)

const charRegex = /^[a-zA-Z0-9\s]+$/

export const CreateUserDataSchema = z.object({
  firstName: z.string().min(3).regex(charRegex, {
    message: 'first name cannot contain special characters',
  }),
  lastName: z.string().min(3).regex(charRegex, {
    message: 'last name cannot contain special characters',
  }),
  email: z
    .string()
    .min(3)
    .regex(emailRegex, { message: 'Invlaid email entered' }),
  password: z
    .string()
    .min(7, { message: 'field cannot be empty' }),
  phone: z
    .string()
    .min(9, { message: 'field cannot be empty' }),
  // userId: z
  //   .string()
  //   .min(3)
  //   .refine((value) => isUUID(value), {
  //     message: 'userId has to be a valid UUID',
  //   }),
})

export const UpdateAwardDataSchema = z.object({
  title: z.string(),
  year: z.string(),
  presented_by: z.string(),
  url: z.string().optional(),
  userId: z.string().refine((value) => isUUID(value), {
    message: 'userId has to be a valid UUID',
  }),
})

// Custom function to validate date strings in "yyyy" format
function validateDateYYYY(dateString: string) {
  const datePattern = /^\d{4}$/
  return datePattern.test(dateString)
}

const options: ErrorMessageOptions = {
  delimiter: {
    error: ' 🔥 ',
  },
  transform: ({ errorMessage, index }) =>
    `Error #${index + 1}: ${errorMessage}`,
}
const data = [
  {
    validation: 'regex',
    code: 'invalid_string',
    message: 'Invlaid email entered',
    path: ['email'],
  },

]

const result = CreateUserDataSchema.safeParse(data)


async function validateCreateUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body

    // Retrieve the "userId" from request parameters
    const userId = req.params.userId

    // Validate the rest of the data against the schema
    // const result = await parseAsync(CreateUserDataSchema, {
    //   ...data,
    //   userId,
    //   options,
    // })
    CreateUserDataSchema.parse(data)

    /// Store the validated data in the request object if needed
    // const validatedData = result
    // console.log(validatedData)
    // next()
  } catch (error) {

      const validationError = fromError(error)
      // the error is now readable by the user
      // you may print it to console
      console.log(validationError.toString())



    // const err = new BadRequestError(error.message)
    // return res.status(400).json({
    //   success: false,
    //   message: error.message,
    // })
    //  let message = 'Invalid input'
    const errorMessage = error.message.split(':').pop().trim()
    // console.log(errorMessage)

    next(new BadRequestError(errorMessage))
  }
}

async function validateUpdateUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = req.body

    // Validate date strings in "yyyy" format
    if (data.year && !validateDateYYYY(data.year)) {
      const err = new BadRequestError(
        "Invalid 'year' date format, it must be 'yyyy'"
      )
      return res.status(err.statusCode).json({ error: err.message })
    }

    // Validate the data against the schema
    const result = await parseAsync(UpdateAwardDataSchema, data, options)

    const validatedData = result
    console.log(validatedData)
    next()
  } catch (error) {
    const err = new BadRequestError(error.message)
    console.error(err.message)
    res.status(err.statusCode).json({ error: err.message })
  }
}
export { validateCreateUserData, validateUpdateUserData }
