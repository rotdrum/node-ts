import express from "express";
import mongoose, { ConnectOptions } from "mongoose";
import morgan from "morgan";
import bodyParser from "body-parser";
import CircuitBreaker from 'opossum';

import loadEnvConfig from "./config/env.config";
loadEnvConfig();

import config from "./config";
import CorsMiddleware from "./middleware/cors.middleware";
import routes from "./routes";

const app = express();
app.disable("x-powered-by");

app.use(CorsMiddleware);
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(`/${config.name}`, routes);

const APP_PORT = config.serverSettings.port || 3000;

app.listen(APP_PORT, () => {
    console.log(`===== SERVER IS SUCCESSFULLY RUNNING AT ${APP_PORT} =====`);

    const DB_NAME = config.dbSettings.db;
    const DB_SERVER = config.dbSettings.server;
    const DB_URL = `mongodb://${DB_SERVER}/${DB_NAME}`;

    async function connectToMongoDB() {
        try {
            const options: ConnectOptions = { bufferCommands: true };
            await mongoose.connect(DB_URL, options);
            console.log('[✔️] DATABASE IS SUCCESSFULLY CONNECTED.');
        } catch (err) {
            console.error('[x] INITIAL MONGODB CONNECTION FAILED', err);
            throw err;
        }
    }

    const breakerOptions = {
        timeout: 5000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
    };

    const breaker = new CircuitBreaker(connectToMongoDB, breakerOptions);

    breaker.on('open', () => console.log('Circuit Breaker is open'));
    breaker.on('halfOpen', () => console.log('Circuit Breaker is half open'));
    breaker.on('close', () => console.log('Circuit Breaker is closed'));
    breaker.on('fallback', () => console.log('Circuit Breaker fallback executed'));

    mongoose.connection.on('disconnected', () => {
        console.log('[!] MONGODB DISCONNECTED. ATTEMPTING TO RECONNECT...');
        breaker.fire()
            .then(() => console.log('[✔️] MONGODB RECONNECTION SUCCESSFUL'))
            .catch((err: any) => console.error('[x] MONGODB RECONNECTION FAILED', err));
    });

    breaker.fire()
        .then(() => console.log('[✔️] INITIAL MONGODB RECONNECTION SUCCESSFUL'))
        .catch((err: any) => console.error('[x] INITIAL MONGODB RECONNECTION FAILED', err));
});

export default app;
