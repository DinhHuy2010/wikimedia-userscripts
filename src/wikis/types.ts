export interface WikiEntryModel {
    db: string;
    url: string;
    wikidataitem: string;
    editionwikidataitem: string | null;
    label: string;
    edition: string | null;
}

export type Wikis = Record<string, WikiEntryModel>;
