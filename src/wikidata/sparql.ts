// deno-lint-ignore no-explicit-any
export async function fetchWDQS(sparqlQuery: string): Promise<any> {
    const endpoint = "https://query.wikidata.org/sparql";
    const fullUrl = endpoint + "?query=" +
        encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };
    const response = await fetch(fullUrl, { headers });
    return response.json();
}
