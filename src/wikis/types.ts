export interface WikiInfo {
    /**
     * @description Name of this wiki instance
     * @type {string}
     */
    label: string;
    /**
     * @description base site URL
     * @type {string}
     */
    url: string;
    /**
     * @description The group this wiki belongs to, e.g., "wiki"
     * @type {string}
     */
    group: string;
}

export type Wikis = Record<string, WikiInfo>;
