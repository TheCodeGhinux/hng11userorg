"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const enitity_1 = require("./enitity");
dotenv.config();
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
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [enitity_1.User, enitity_1.Organisation],
    synchronize: true,
    logging: false,
    ssl: {
        rejectUnauthorized: false,
    },
});
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
//# sourceMappingURL=app-data-source.js.map