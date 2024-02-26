import { RequestByBrowserItemDb } from "../database/models/requestByBrowserItemDb";
import { RequestByDeviceItemDb } from "../database/models/requestByDeviceItemDb";
import { RequestByMonthItemDb } from "../database/models/requestByMonthItemDb";
import { RequestByOperationalSystemItemDb } from "../database/models/requestByOperationalSystemItemDb";
import { RequestByWeekItemDb } from "../database/models/requestByWeekItemDb";
import { UrlMapperItemDb } from "../database/models/urlMapperItemDb";
import { UrlMapperItem } from "../interfaces/urlMapperItem";

class ParseUrlMapperItemsResponseHelper {
    public static parseUrlMapperItems(
        urlMapperItemsDb: UrlMapperItemDb[],
        requestInfoByWeek: RequestByWeekItemDb[],
        requestInfoByMonth: RequestByMonthItemDb[],
        requestInfoByDevices: RequestByDeviceItemDb[],
        requestInfoByOperationalSystem: RequestByOperationalSystemItemDb[],
        requestInfoByBrowser: RequestByBrowserItemDb[]): UrlMapperItem[] {

        let urlMapperItems: UrlMapperItem[] = urlMapperItemsDb

        urlMapperItemsDb.forEach(urlMapperItemDb => {
            const urlMapperItem = urlMapperItems.find(urlMapperItem => urlMapperItem.id === urlMapperItemDb.id);
            if (urlMapperItem) {
                urlMapperItem.request_per_weeks = this.parseRequestInfo(requestInfoByWeek, urlMapperItemDb.id, 'weekStartDate');
                urlMapperItem.request_per_months = this.parseRequestInfo(requestInfoByMonth, urlMapperItemDb.id, 'monthStartDate');
                urlMapperItem.request_per_devices = this.parseRequestInfo(requestInfoByDevices, urlMapperItemDb.id, 'device');
                urlMapperItem.request_per_operational_systems = this.parseRequestInfo(requestInfoByOperationalSystem, urlMapperItemDb.id, 'operationalSystem');
                urlMapperItem.request_per_browser = this.parseRequestInfo(requestInfoByBrowser, urlMapperItemDb.id, 'browser');
            }
        });

        return urlMapperItems;
    }

    public static parseUrlMapperItem(
        urlMapperItemDb: UrlMapperItemDb,
        requestInfoByWeek: RequestByWeekItemDb[],
        requestInfoByMonth: RequestByMonthItemDb[],
        requestInfoByDevices: RequestByDeviceItemDb[],
        requestInfoByOperationalSystem: RequestByOperationalSystemItemDb[],
        requestInfoByBrowser: RequestByBrowserItemDb[]): UrlMapperItem {

        let urlMapperItem: UrlMapperItem = urlMapperItemDb

        urlMapperItem.request_per_weeks = this.parseRequestInfo(requestInfoByWeek, urlMapperItemDb.id, 'weekStartDate');
        urlMapperItem.request_per_months = this.parseRequestInfo(requestInfoByMonth, urlMapperItemDb.id, 'monthStartDate');
        urlMapperItem.request_per_devices = this.parseRequestInfo(requestInfoByDevices, urlMapperItemDb.id, 'device');
        urlMapperItem.request_per_operational_systems = this.parseRequestInfo(requestInfoByOperationalSystem, urlMapperItemDb.id, 'operationalSystem');
        urlMapperItem.request_per_browser = this.parseRequestInfo(requestInfoByBrowser, urlMapperItemDb.id, 'browser');

        return urlMapperItem;
    }

    private static parseRequestInfo(requestInfo: any[], urlMapperId: number, key: string): any[] {
        const filteredInfo = requestInfo.filter(info => info.urlMapper_id === urlMapperId);
        return filteredInfo.map(info => ({
            [key]: info[key],
            request_count: parseInt(info.count)
        }));
    }
}

export default ParseUrlMapperItemsResponseHelper
