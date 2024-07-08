import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import { User, Organisation } from './enitity'
dotenv.config()
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: 'aws-0-us-east-1.pooler.supabase.com',
//   port: 5432,
//   username: 'postgres.mcletvgbkvjlnvgasafu',
//   password: 'Hng11userdb',
//   database: 'hng11two',
//   entities: [User, Organisation],
//   synchronize: true,
//   logging: false,
// })

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Organisation],
  synchronize: true,
  logging: false,
  ssl: {
    rejectUnauthorized: false,
  },
})

// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: DB_HOST,
//   port: parseInt(DB_PORT || '5432'),
//   username: DB_USERNAME,
//   password: DB_PASSWORD,
//   database: DB_DATABASE,

//   synchronize: NODE_ENV === 'dev' ? false : false,
//   //logging logs sql command on the treminal
//   logging: NODE_ENV === 'dev' ? false : false,
//   entities: [User, Movie],
//   migrations: [__dirname + '/migration/*.ts'],
//   subscribers: [],
// })
