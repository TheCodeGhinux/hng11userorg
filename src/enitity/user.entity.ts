import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { Organisation } from './organisation.entity'
import { IsNotEmpty, IsString, IsPhoneNumber, Length, IsEmail } from 'class-validator'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  @Length(3, 255, {
    message: 'First name must be between 3 and 255 characters',
  })
  firstName: string

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  @Length(3, 255, { message: 'Last name must be between 3 and 255 characters' })
  lastName: string

  @Column({ nullable: true, unique: true })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @IsString({ message: 'First name must be a string' })
  @IsEmail()
  email: string

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'Password name cannot be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string

  @Column({ nullable: true })
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  @IsString({ message: 'Phone number must be a string' })
  @Length(10, 14, {
    message: 'Phone number must be between 10 and 14 characters',
  })
  phone: string

  @OneToMany(() => Organisation, (organisation) => organisation.createdBy)
  createdOrganisations: Organisation[]

  @ManyToMany(() => Organisation, (organisation) => organisation.users)
  @JoinTable()
  organisations: Organisation[]
}
