import { Request } from 'express';
import useragent from 'useragent';

export class UserAgentHelper {
    static parseUserAgent(req: Request): { device: string, os: string, browser: string } {
        const userAgent = req.headers['user-agent'];
        const agent = useragent.parse(userAgent);

        return {
            device: agent.device.family === 'Other' ? 'Desktop' : agent.device.family,
            os: agent.os.family,
            browser: agent.family
        };
    }
}
