export async function parseXML(xmlText: string) {
    // Simple regex parser for the specific eSewa response format
    // Success: <response><response_code>Success</response_code></response>
    // Failure: <response><response_code>failure</response_code></response>
    // Note: In a real app, use a proper XML parser.
    const responseCodeMatch = xmlText.match(/<response_code>(.*?)<\/response_code>/);
    return {
        response_code: responseCodeMatch ? responseCodeMatch[1].trim() : null
    };
}
