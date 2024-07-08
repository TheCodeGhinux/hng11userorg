import express from 'express'
import { readdirSync } from 'fs'
// import { sayHelloController } from "./controllers/index";
import 'dotenv/config'
import { errorHandler } from './middlewares/index'
import session from 'express-session'
import cors from 'cors'
import morgan from 'morgan'
import https from 'https'
import cron from 'node-cron'
import { Server, createServer } from 'http'
import cookieParser from 'cookie-parser'
import { AppDataSource } from './app-data-source'

// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = require("./swagger");

const app = express()

app.use(morgan('dev'))

//  Swagger UI
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

function keepAlive(url) {
  https
    .get(url, (res) => {
      console.log(`Status: ${res.statusCode}`)
    })
    .on('error', (error) => {
      console.error(`Error: ${error.message}`)
    })
}


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


app.use(cookieParser())

app.get('/', (req, res) => {
  res.json({ message: 'Hello HNG 11 ' })
}) 


//serve all routes dynamically using readdirsync
readdirSync('./src/routes').map((path) => {
  if (!path.includes('auth')) {
    // app.use("/api/v1/", authenticateJWT, require(`./routes/${path}`));
    app.use('/api/', require(`./routes/${path}`))
  } else {
    app.use('/api/', require(`./routes/${path}`))
  }
})
// app.get("/", sayHelloController);
app.use(errorHandler)
const port = process.env.PORT || 3000

const httpServer = createServer(app)


AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log('Server is running on http://localhost:' + port)
    })
    console.log('Data Source has been initialized!')
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err)
  })


  export default app