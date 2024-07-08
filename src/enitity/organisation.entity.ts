import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm'
import { User } from './user.entity'
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

@Entity({ name: 'organisations' })
export class Organisation {
  @PrimaryGeneratedColumn('uuid')
  orgId: string

  @Column()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @IsString({ message: 'Name must be a string' })
  @Length(3, 255, { message: 'Name must be between 1 and 255 characters' })
  name: string

  @Column({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string

  @ManyToOne(() => User, (user) => user.createdOrganisations)
  createdBy: User

  @ManyToMany(() => User, (user) => user.organisations)
  users: User[]
}
