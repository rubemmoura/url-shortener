import axios from 'axios';
import { DecodedTokenItem } from '../interfaces/decodedTokenItem';

export class AuthHelper {
    static async verifyToken(token: string | undefined): Promise<DecodedTokenItem | null> {
        const verifyTokenAuth = 'http://url-shortener-auth:3000/auth/verify-token';
        try {
            if (token) {
                const verifyTokenResponse = await axios.post(verifyTokenAuth, { token });

                if (verifyTokenResponse.status === 200) {
                    return verifyTokenResponse.data.decoded;
                } else {
                    throw new Error('Unauthorized: Invalid token');
                }
            } else {
                throw new Error('Unauthorized: Invalid token');
            }
        } catch (error) {
            throw new Error('Unauthorized: Invalid token');
        }
    }

    static async getUserRole(token: string | undefined): Promise<string | undefined> {
        try {
            if (!token) return undefined;

            const decodedToken = await this.verifyToken(token);
            return decodedToken?.role;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }

    static async getUserEmail(token: string | undefined): Promise<string | undefined> {
        try {
            if (!token) return undefined;

            const decodedToken = await this.verifyToken(token);
            return decodedToken?.email;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
}
