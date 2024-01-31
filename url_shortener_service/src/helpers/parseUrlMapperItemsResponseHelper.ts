import { UrlMapperItemDb } from "../database/models/urlMapperItemDb";
import { UrlMapperItem } from "../interfaces/urlMapperItem";

class ParseUrlMapperItemsResponseHelper {
    public static parseUrlMapperItems(
        urlMapperItemsDb: UrlMapperItemDb[],
        requestInfoByWeek: any[],
        requestInfoByMonth: any[],
        requestInfoByDevices: any[],
        requestInfoByOperationalSystem: any[],
        requestInfoByBrowser: any[]): UrlMapperItem[] {

        let urlMapperItems: UrlMapperItem[] = urlMapperItemsDb

        urlMapperItemsDb.forEach(urlMapperItemDb => {
            const urlMapperItem = urlMapperItems.find(urlMapperItem => urlMapperItem.id === urlMapperItemDb.id);
            if (urlMapperItem) {

                urlMapperItem.request_per_weeks = this.parseRequestInfo(requestInfoByWeek, urlMapperItemDb.id, 'week_start');
                urlMapperItem.request_per_months = this.parseRequestInfo(requestInfoByMonth, urlMapperItemDb.id, 'month_start');
                urlMapperItem.request_per_devices = this.parseRequestInfo(requestInfoByDevices, urlMapperItemDb.id, 'device');
                urlMapperItem.request_per_operational_systems = this.parseRequestInfo(requestInfoByOperationalSystem, urlMapperItemDb.id, 'operationalSystem');
                urlMapperItem.request_per_browser = this.parseRequestInfo(requestInfoByBrowser, urlMapperItemDb.id, 'browser');
            }
        });

        return urlMapperItems;
    }

    public static parseUrlMapperItem(
        urlMapperItemDb: UrlMapperItemDb,
        requestInfoByWeek: any[],
        requestInfoByMonth: any[],
        requestInfoByDevices: any[],
        requestInfoByOperationalSystem: any[],
        requestInfoByBrowser: any[]): UrlMapperItem {

        let urlMapperItem: UrlMapperItem = urlMapperItemDb

        urlMapperItem.request_per_weeks = this.parseRequestInfo(requestInfoByWeek, urlMapperItemDb.id, 'week_start');
        urlMapperItem.request_per_months = this.parseRequestInfo(requestInfoByMonth, urlMapperItemDb.id, 'month_start');
        urlMapperItem.request_per_devices = this.parseRequestInfo(requestInfoByDevices, urlMapperItemDb.id, 'device');
        urlMapperItem.request_per_operational_systems = this.parseRequestInfo(requestInfoByOperationalSystem, urlMapperItemDb.id, 'operationalSystem');
        urlMapperItem.request_per_browser = this.parseRequestInfo(requestInfoByBrowser, urlMapperItemDb.id, 'browser');

        return urlMapperItem;
    }

    private static parseRequestInfo(requestInfo: any[], urlMapperId: number, key: string): any[] {
        const filteredInfo = requestInfo.filter(info => info.urlMapper_id === urlMapperId);
        return filteredInfo.map(info => ({
            [key]: info[key],
            request_count: parseInt(info.register_count)
        }));
    }
}

export default ParseUrlMapperItemsResponseHelper
