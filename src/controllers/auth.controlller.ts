import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { ResponseHandler } from '../utils'
import { generateToken } from '../utils/jwtUtils'
import { AppDataSource } from '../app-data-source'
import { Organisation, User } from '../enitity'
import { CreateUserDataSchema } from '../middlewares/validations/user.zod'
import { fromError } from 'zod-validation-error'
import { BadRequestError, UnprocessableEntityError } from '../middlewares'

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const { email, password } = req.body

    const user = await userRepository.findOneBy({ email: email })

    if (!user) {
      throw new BadRequestError('No user found with the email')
    }

    const checkPassword = await bcrypt.compare(password, user.password)
    if (!checkPassword) {
      throw new BadRequestError(
        'Invalid password, please provide a valid password'
      )
    }

    const token = generateToken(user)

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    const userResponse = {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    }

    const response = {
      accessToken: token,
      user: userResponse,
    }
    ResponseHandler.success(res, response, 200, 'Logged in successfully')
  } catch (error) {
    next(error)
  }
}

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const organisationRepository = AppDataSource.getRepository(Organisation)

    // Extract user data from request body
    const { firstName, lastName, email, password, phone } = req.body

    // const schemaRes = CreateUserDataSchema.parse(req.body)
    try {
      CreateUserDataSchema.parse(req.body)
    } catch (err) {
      const validationError = fromError(err).toString()
      throw new UnprocessableEntityError(validationError)
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    if (!hashedPassword) {
      throw new BadRequestError(
        'Invalid password, please provide a valid password'
      )
    }

    // Create a new user
    const newUser = userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    })

    // Save user to database
    await userRepository.save(newUser)

    // Generate organization name
    const orgName = `${firstName}'s Organisation`

    // Create a new organisation linked to the user
    const newOrganisation = organisationRepository.create({
      name: orgName,
      createdBy: newUser,
    })

    // Save organisation to database
    await organisationRepository.save(newOrganisation)

    const token = generateToken(newUser)

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })

    const userResponse = {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
    }

    const response = {
      accessToken: token,
      user: userResponse,
    }

    // Respond with success message
    ResponseHandler.success(
      res,
      response,
      201,
      'User and organization created successfully'
    )
  } catch (error) {
    // console.error('Error creating user and organisation:', error)
    next(error)
  }
}
