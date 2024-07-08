import { AppDataSource } from '../app-data-source'
import { Organisation, User } from '../enitity'
import { BadRequestError } from '../middlewares'

export const updateOrganisationUsers = async (
  organisationId: string,
  userId: string,
  action: 'add' | 'remove'
) => {
  const organisationRepository = AppDataSource.getRepository(Organisation)
  const userRepository = AppDataSource.getRepository(User)

  const organisation = await organisationRepository.findOne({
    where: { orgId: organisationId },
    relations: ['users'],
  })

  if (!organisation) {
    throw new Error('Organisation not found')
  }
  console.log("user id in helper:", userId);
  

  const user = await userRepository.findOneBy({ userId })

  if (!user) {
    throw new Error('User not found')
  }

  if (action === 'add') {
    const userExists = organisation.users.some((u) => u.userId === userId)
    if (userExists) {
      throw new BadRequestError('User already exists in the organisation')
    }
    organisation.users.push(user)
  } else if (action === 'remove') {
    organisation.users = organisation.users.filter((u) => u.userId !== userId)
  }

  await organisationRepository.save(organisation)
}
