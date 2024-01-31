export interface UrlMapperItem {
    id?: number;
    longUrl: string;
    hash: string;
    createdBy?: string;
    createdAt: string;
    week_start?: string;
    week_request_count?: number;
    month_start?: string;
    month_request_count?: number;
    request_per_weeks?: RequestPerWeek[],
    request_per_months?: RequestPerMonth[],
    request_per_devices?: RequestPerDevices[],
    request_per_operational_systems?: RequestPerOperationalSystem[],
    request_per_browser?: RequestPerBrowser[],
}

interface RequestPerDevices {
    device: string,
    request_count: number
}

interface RequestPerOperationalSystem {
    operationalSystem: string,
    request_count: number
}

interface RequestPerBrowser {
    browser: string,
    request_count: number
}
interface RequestPerWeek {
    week_start: string;
    request_count: number;
}
interface RequestPerMonth {
    month_start: string;
    request_count: number;
}