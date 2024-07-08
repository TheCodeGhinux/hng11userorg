import { NextFunction } from 'express'
import { Request, Response } from 'express'
import { AppDataSource } from '../app-data-source'
import { Organisation, User } from '../enitity'
import { ResponseHandler } from '../utils'
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
} from '../middlewares'
import { UserService } from '../services/user.service'
import { updateOrganisationUsers } from '../helpers/orgHelper.helper'
import { CreateOrgDataSchema } from '../middlewares/validations/organisation.zod'
import { fromError } from 'zod-validation-error'

export const createOrganisation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User)
    const organisationRepository = AppDataSource.getRepository(Organisation)

    // Extract user data from request body
    const { name, description } = req.body
    try {
      CreateOrgDataSchema.parse(req.body)
    } catch (err) {
      const validationError = fromError(err).toString()
      throw new UnprocessableEntityError(validationError)
    }

    const userId = req.user?.userId

    if (!userId) {
      throw new BadRequestError('User not found')
    }

    const user = await userRepository.findOneBy({ userId: userId })

    if (!user) {
      throw new BadRequestError('No user found with the email')
    }

    const newOrganisation = organisationRepository.create({
      name,
      description,
      createdBy: userId, // Assign the logged-in user as the creator
    })

    // Save the new organisation to the database
    await organisationRepository.save(newOrganisation)

    const responseData = {
      name: newOrganisation.name,
      description: newOrganisation.description,
    }

    // Respond with success message
    ResponseHandler.success(
      res,
      responseData,
      201,
      'New organization created successfully'
    )
  } catch (error) {
    console.error('Error creating user and organisation:', error)
    next(error)
  }
}

export const getAllOrganisation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const organisationRepository = AppDataSource.getRepository(Organisation)

    // Query organizations where the logged-in user is either the creator or a member
    const organisations = await organisationRepository
      .createQueryBuilder('organisation')
      .leftJoinAndSelect('organisation.users', 'user')
      .leftJoinAndSelect('organisation.createdBy', 'creator')
      .where('user.userId = :userId OR creator.userId = :userId', { userId })
      .getMany()

    const responseData = {
      organisations: organisations.map((org) => ({
        orgId: org.orgId,
        name: org.name,
        description: org.description || '',
      })),
    }
    ResponseHandler.success(
      res,
      responseData,
      200,
      'Organisations fetched successfully'
    )
  } catch (error) {
    console.error('Error getting organisations:', error)
    next(error)
  }
}

export const getUserOrganisation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId
    const organisationId = req.params.orgId
    console.log(req.user)

    if (!userId) {
      throw new BadRequestError('User not found')
    }

    const organisationRepository = AppDataSource.getRepository(Organisation)

    // Query the organization by orgId and ensure the logged-in user has access
    const organisation = await organisationRepository
      .createQueryBuilder('organisation')
      .leftJoinAndSelect('organisation.users', 'user')
      .leftJoinAndSelect('organisation.createdBy', 'creator')
      .where(
        'organisation.orgId = :organisationId AND (user.userId = :userId OR creator.userId = :userId)',
        {
          organisationId,
          userId,
        }
      )
      .getOne()

    if (!organisation) {
      throw new NotFoundError('Organisation not found or access denied')
    }

    const responseData = {
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description || '',
    }

    ResponseHandler.success(
      res,
      responseData,
      200,
      'Organisation fetched successfully'
    )
  } catch (error) {
    console.error('Error getting organisation:', error)
    next(error)
  }
}

export const getOrganisationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { email } = req.params
    // const user = await userService.getUserByEmail(email)
    // if (!user) {
    //   throw new NotFoundError(`User with ${email} not found`)
    // }
    // ResponseHandler.success(res, user, 200, 'User fetched successfully')
  } catch (error) {
    console.error('Error getting user by firstName:', error)
    next(error)
  }
}

export const addUserToOrganisation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.body
  const { orgId } = req.params
  console.log(orgId)

  try {
    const userRepository = AppDataSource.getRepository(User)
    const organisationRepository = AppDataSource.getRepository(Organisation)

    if(!userId){
      throw new BadRequestError('No user id provided')
    }

    if(!orgId){
      throw new BadRequestError('No user id provided')
    }

    const organsationId = await organisationRepository.findOneBy({
      orgId: orgId,
    })

    if (!organsationId) {
      throw new NotFoundError('No organisation found with the provided ID')
    }

    const user = await userRepository.findOneBy({ userId: userId })

    if(!user){
      throw new NotFoundError('No user found with the provided ID')
    }

    await updateOrganisationUsers(orgId, userId, 'add')
    const responseData = {

    }


    ResponseHandler.success(
      res,
      null,
      200,
      'User added to organisation successfully'
    )
  } catch (error) {
    console.error('Error adding user to organisation:', error)
    next(error)
  }
}

export const removeUserFromOrganisation = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { organisationId, userId } = req.body

  try {
    await updateOrganisationUsers(organisationId, userId, 'remove')
    ResponseHandler.success(
      res,
      null,
      200,
      'User removed from organisation successfully'
    )
  } catch (error) {
    console.error('Error removing user from organisation:', error)
    next(error)
  }
}
