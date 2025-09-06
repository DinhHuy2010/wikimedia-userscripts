// deno-lint-ignore no-explicit-any
export async function fetchWDQS(sparqlQuery: string): Promise<any> {
    const endpoint = "https://query.wikidata.org/sparql";
    const fullUrl = endpoint + "?query=" +
        encodeURIComponent(sparqlQuery);
    const headers = { "Accept": "application/sparql-results+json" };
    const response = await fetch(fullUrl, { headers });
    if (!response.ok) {
        throw new Error(mw.msg("mw-dhscript-wikidata-spraql-httperror", response.status, response.statusText));
    }
    return response.json();
}