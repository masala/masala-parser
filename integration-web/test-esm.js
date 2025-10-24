export function testEsm(F, standard, Streams) {
    // Test simple direct case
    const text = 'Hello, world!'
    const startsWithHparser = F.satisfy((str) => {
        return str.includes('H')
    }).returns('Success')

    // Test the full library across GenLex
    const jsonParser = standard.jsonParser
    const jsonDocument = '{"ok":true}'

    const jsonParserResult = jsonParser.parse(Streams.ofChars(jsonDocument))

    const jsonSuccess = jsonParserResult.value.ok === true
    console.log({ jsonParserResult, jsonSuccess })

    return startsWithHparser.val(text) && jsonSuccess
        ? 'Masala Parser ESM Integration Success'
        : 'Masala Parser ESM Integration Failure'
}
