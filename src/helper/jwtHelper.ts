import jwt from 'jsonwebtoken'

export const createJsonWebToken = (tokenPayload: object, secretKey: string, expiresIn = '') => {
    try {
        if (!tokenPayload) {
            throw new Error('tokenPayload must be non-empty object');
        }
        if (secretKey === '') {
            throw new Error('secretKey must be non-empty string');
        }
        const token = jwt.sign(tokenPayload, secretKey, {
            expiresIn: expiresIn,
        });
        return token;
    } catch (error) {
        throw error;
    }
};

export const verifyJsonWebToken = (token = '', dsecretKey = '') => { };
