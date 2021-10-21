import express from 'express';
import cors from "cors";
import * as dotenv from "dotenv";

import { RegisterRoutes } from "./modules/controller"

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}
const PORT: number = parseInt(process.env.PORT as string, 10);

// Server
export const app = express();

/**
 *  Configuration
 */

// enable all CORS requests
// Without this, API would only be usable from front ends being served from the exact same subdomain as our back end.
app.use(cors());

// parse incoming requests with JSON, body object containing the parsed data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// swagger documentation

const swagger = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        info: {
            title: "API Documentation",
            description: "Simplify API development for calculator.",
            version: "1.0.0",
            consumes: ["application/json"],
            produces: ["application/json"],
            schema: ["http", "https"],
            host: process.env.APP_URL,
            basePath: "/",
        },
    },
    apis: ["src/index.ts", "./src/modules/controller/**/**.routes.ts"], // Path to the API docs
};

const swaggerDocument = swagger(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


/**
 * Register routes
 */
RegisterRoutes(app);

/**
 * @Route for page not found
 */
app.use(function (req, res, next) {
    res.status(404).send("Endpoint no found!")
})


// start server

const server = app.listen(PORT);

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
    console.log("  Press CTRL-C to stop\n");
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof PORT === 'string'
        ? 'Pipe ' + PORT
        : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}