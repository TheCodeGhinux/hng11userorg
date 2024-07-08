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

export const CreateOrgDataSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
})
