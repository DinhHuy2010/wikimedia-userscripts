// deno-lint-ignore no-explicit-any
export async function fetchWDQS(sparqlQuery: string): Promise<any> {
    const endpoint = "https://query.wikidata.org/sparql";
    const headers = {
        "Accept": "application/sparql-results+json",
        "Content-Type": "application/x-www-form-urlencoded",
    };
    const params = new URLSearchParams({ query: sparqlQuery });
    const response = await fetch(endpoint, {
        headers,
        method: "POST",
        body: params.toString(),
    });
    if (!response.ok) {
        throw new Error(
            mw.msg(
                "mw-dhscript-wikidata-spraql-httperror",
                response.status,
                response.statusText,
            ),
        );
    }
    return response.json();
}
