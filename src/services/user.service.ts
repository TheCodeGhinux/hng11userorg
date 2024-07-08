import { Repository } from 'typeorm'
import { AppDataSource } from '../app-data-source'
import { User } from '../enitity/user.entity'

export class UserService {
  private userRepository: Repository<User>

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const newUser = await this.userRepository.create(userData)
      return await this.userRepository.save(newUser)
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find()
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { email: email },
      })
    } catch (error) {
      console.error(`Error getting user with ID ${email}:`, error)
      throw error
    }
  }
  async getUserById(id: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { userId: id },
      })
    } catch (error) {
      console.error(`Error getting user with ID ${id}:`, error)
      throw error
    }
  }

  async getUserByFirstName(firstName: string): Promise<User | undefined> {
    try {
      return await this.userRepository.findOne({
        where: { firstName: firstName },
      })
    } catch (error) {
      console.error(`Error getting user with ID ${firstName}:`, error)
      throw error
    }
  }
}
