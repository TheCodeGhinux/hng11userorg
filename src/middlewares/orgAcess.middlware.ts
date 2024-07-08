import { Response, NextFunction } from 'express'
import { AppDataSource } from "../app-data-source"
import { Organisation } from "../enitity"
import { BadRequestError, ForbiddenError } from "./errorhandler"

export const orgAccessGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.userId
  const organisationId = req.params.id || req.body.organisationId

  if (!userId || !organisationId) {
    throw new BadRequestError('User not found')
  }

  try {
    const organisationRepository = AppDataSource.getRepository(Organisation)

    const organisation = await organisationRepository.findOne({
      where: { orgId: organisationId },
      relations: ['users', 'createdBy'],
    })

    if (!organisation) {
      throw new BadRequestError('Organisation not found')
    }

    const isCreator = organisation.createdBy.userId === userId
    const isMember = organisation.users.some((user) => user.userId === userId)

    if (isCreator || isMember) {
      return next()
    } else {
      throw new ForbiddenError('User not authorized for this action')
    }
  } catch (error) {
    console.error('Error checking organisation access:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
