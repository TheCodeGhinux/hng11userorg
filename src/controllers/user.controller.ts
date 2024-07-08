import { NextFunction } from 'express'
import { Request, Response } from 'express'
import { AppDataSource } from '../app-data-source'
import { Organisation, User } from '../enitity'
import { ResponseHandler } from '../utils'
import { BadRequestError, NotFoundError, UnprocessableEntityError } from '../middlewares'
import { UserService } from '../services/user.service'

const userService = new UserService()

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ['userId', 'firstName', 'lastName', 'phone'],
    })
    ResponseHandler.success(res, users, 200, 'Users fetched succesfully')
  } catch (error) {
    console.error('Error getting users:', error)
    next(error)
  }
}

const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.params
    const user = await userService.getUserByEmail(email)

    if (!user) {
      throw new NotFoundError(`User with ${email} not found`)
    }

    ResponseHandler.success(res, user, 200, 'User fetched successfully')
  } catch (error) {
    console.error('Error getting user by firstName:', error)
    next(error)
  }
}

const getUserByFirstName = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName } = req.params
    const user = await userService.getUserByFirstName(firstName)

    if (!user) {
      throw new NotFoundError(`User with ${firstName} not found`)
    }

    ResponseHandler.success(res, user, 200, 'User fetched successfully')
  } catch (error) {
    console.error('Error getting user by firstName:', error)
    next(error)
  }
}

const getUserById = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.params.id
  const user = req.user

  console.log(user);
  
  try {
    const user = await userService.getUserById(userId)

    if (!user) {
      throw new BadRequestError(`User with id ${userId} not found`)
    } else {
      ResponseHandler.success(res, user, 200, 'User fetched successfully')
    }
  } catch (error) {
    return next(error)
  }
}

// const updateUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userData = req.body
//     const userId = req.params.id

//     if (!userId) {
//       throw new BadRequestError(`No user id found`)
//     }

//     const user = await findUserById(userId)

//     if (!user) {
//       throw new BadRequestError(`User with id ${userId} not found`)
//     }

//     if (!req.body) {
//       throw new BadRequestError('No data provided in body')
//     }

//     for (const key in userData) {
//       if (userData.hasOwnProperty(key)) {
//         user[key] = userData[key]
//       }
//     }

//     const updatedUser = await prisma.user.update({
//       where: { userID: userId },
//       data: user,
//     })
//     ResponseHandler.success(res, updatedUser, 200, 'User updated successfully')
//   } catch (error) {
//     next(error)
//   }
// }

// const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.params.id

//     const user = await findUserById(userId)
//     if (!user) {
//       throw new BadRequestError(`User with id ${userId} not found`)
//     }

//     const deletedUser = await prisma.user.delete({ where: { userID: userId } })

//     ResponseHandler.success(res, deletedUser, 200, 'User successfully deleted')
//   } catch (error) {
//     next(error)
//   }
// }

export { getAllUsers, getUserByFirstName, getUserByEmail, getUserById }
