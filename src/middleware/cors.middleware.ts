import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: process.env.CORS_ORIGIN_ALLOWANCES !== undefined ? JSON.parse(process.env.CORS_ORIGIN_ALLOWANCES) : null,
    methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
};

const CorsMiddleware = cors(corsOptions);

export default CorsMiddleware;
