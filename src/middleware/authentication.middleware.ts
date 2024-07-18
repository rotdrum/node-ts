import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import config from '../config';
import jwt, { GetPublicKeyOrSecret, Secret } from 'jsonwebtoken';

const AuthMiddleware = (req: any, res: Response, next: NextFunction) => {
    try {
        const reqHeaders = req.headers;
        const headerAuthorization = reqHeaders.authorization || '';

        if (headerAuthorization.startsWith('Bearer ')) { 
            const bearerToken = headerAuthorization.split(' ')[1];
            if (bearerToken) {
                try {
                    const apiKey = config.tokenSettings.apiSecretKey;
                    
                    if (!_.isNil(apiKey) && bearerToken === apiKey) {
                        req.jwtDecode = req.query || {};
                    } else {
                        const publicKey = config.tokenSettings.publicKey as Secret | GetPublicKeyOrSecret;
                        const decodedToken = jwt.verify(bearerToken, publicKey) as any;
                        req.jwtDecode = decodedToken;
                    }
                    return next();
                } catch (error) {
                    console.log(`Error:`, error);
                    return res.status(401).send({ message: 'Invalid Access Token' });
                }
            }
        }
        return res.status(401).send({ message: 'Missing Authorization Header' });
    } catch (error: any) {
        console.log(`Error: `, error);
        const errorMessage = !_.isUndefined(error.message) ? error.message : error;
        return res.status(500).send({ message: `Server Error, authentication method errors. ${errorMessage}` });
    }
};

export default AuthMiddleware;
