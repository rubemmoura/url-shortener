import axios from 'axios';
import { DecodedTokenItem } from '../interfaces/decodedTokenItem';

export class AuthHelper {
    static async verifyToken(token: string): Promise<DecodedTokenItem> {
        const verifyTokenAuth = 'http://url-shortener-auth:3000/auth/verify-token';
        try {
            const verifyTokenResponse = await axios.post(verifyTokenAuth, { token });

            if (verifyTokenResponse.status === 200) {
                return verifyTokenResponse.data.decoded;
            } else {
                throw new Error('Unauthorized: Invalid token');
            }
        } catch (error) {
            throw new Error('Unauthorized: Invalid token');
        }
    }
}
