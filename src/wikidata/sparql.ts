class WDQSQueryDispatcher {
    endpoint: "https://query.wikidata.org/sparql";
    constructor() {
        this.endpoint = "https://query.wikidata.org/sparql";
    }

    async query(sparqlQuery: string): Promise<unknown> {
        const fullUrl = this.endpoint + "?query=" +
            encodeURIComponent(sparqlQuery);
        const headers = { "Accept": "application/sparql-results+json" };

        const response = await fetch(fullUrl, { headers });
        return response.json();
    }
}

const queryDispatcher = new WDQSQueryDispatcher();
