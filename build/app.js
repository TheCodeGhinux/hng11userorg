"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
// import { sayHelloController } from "./controllers/index";
require("dotenv/config");
const index_1 = require("./middlewares/index");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const https_1 = __importDefault(require("https"));
const http_1 = require("http");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_data_source_1 = require("./app-data-source");
// const swaggerUi = require("swagger-ui-express");
// const swaggerOptions = require("./swagger");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
//  Swagger UI
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));
function keepAlive(url) {
    https_1.default
        .get(url, (res) => {
        console.log(`Status: ${res.statusCode}`);
    })
        .on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });
}
// cron job to ping the server every minute and delete expired tokens every 5 minutes
// cron.schedule("*/5 * * * *", () => {
//   keepAlive("//");
//   deleteExpiredTokens();
//   console.log("deleting expired tokens every 5 minutes");
//   console.log("pinging the server every minute");
// });
// middleware setup
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// app.use(
//   session({
//     secret: process.env.JWT_SECRET || "secret",
//     resave: true,
//     saveUninitialized: true,
//   })
// );
app.use((0, cookie_parser_1.default)());
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(authToken);
//serve all routes dynamically using readdirsync
(0, fs_1.readdirSync)('./src/routes').map((path) => {
    if (!path.includes('auth')) {
        // app.use("/api/v1/", authenticateJWT, require(`./routes/${path}`));
        app.use('/api/', require(`./routes/${path}`));
    }
    else {
        app.use('/api/', require(`./routes/${path}`));
    }
});
// app.get("/", sayHelloController);
app.use(index_1.errorHandler);
const port = process.env.PORT || 3000;
const httpServer = (0, http_1.createServer)(app);
// AppDataSource.initialize()
//   .then(async () => {
//     app.listen(port, () => {
//       console.log('Server is running on http://localhost:' + port)
//     })
//     console.log('Data Source has been initialized!')
//   })
//   .catch((error) => console.log(error))
app_data_source_1.AppDataSource.initialize()
    .then(() => {
    app.listen(port, () => {
        console.log('Server is running on http://localhost:' + port);
    });
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
//# sourceMappingURL=app.js.map