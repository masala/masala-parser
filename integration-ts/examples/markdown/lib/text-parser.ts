/**
 * Created by Simon on 14/12/2016.
 */

/**
 * This parse a text paragraph
 * text can be "simple" text; bold, italic or a mix (sequence) of those
 * a paragraph ends with a blank line("\n\n" or "\n  \t  \n") or "end of stream" (F.eos())
 *
 * Another solution is to use Genlex with stops on spaces and \n, then to reduce the text tokens
 * in bigger text.
 */
import { F, C, SingleParser, IParser } from '@masala/parser'

import { FormattedSequence, MdText, Paragraph } from './types'
import { blank, eol, lineFeed } from './token'

//TODO: no good at all=> For simplicity, bold, italic and code cannot go across different lines
function stop() {
    return F.eos().or(eol()).or(C.charIn('*`'))
    // real case would accept linefeed() instead of eol(), then probably a back parser when last char is '\n'
}

function pureText() {
    return (
        F.not(stop())
            .rep()
            .map((chars) => chars.join(''))

            /*.map(chars => {
                let allChars = chars.join('');
                return allChars.replace(/\n/g, ' ').replace(/\r/g, '');
            })*/
            .map((text) => text.trim())
    )
}

function italic(): SingleParser<MdText> {
    return C.char('*')
        .drop()
        .then(pureText())
        .then(C.char('*').drop())
        .single()
        .map((s: string) => ({ type: 'italic', text: s }))
}

function bold(): SingleParser<MdText> {
    return C.string('**')
        .drop()
        .then(pureText())
        .then(C.string('**').drop())
        .single()
        .map((s: string) => ({ type: 'bold', text: s }))
}

function code(): SingleParser<MdText> {
    return C.char('`')
        .drop()
        .then(pureText())
        .then(C.char('`').drop())
        .single()
        .map((s: string) => ({ type: 'code', text: s }))
}

function text(): SingleParser<MdText> {
    return pureText().map((s) => ({ type: 'text', text: s }))
}

export function formattedLine(): SingleParser<MdText[]> {
    return bold().or(italic()).or(text()).or(code()).rep().array()
}
/**
 * @param pureTextParser :SingleParser<string>  defines if a text accept some chars or not
 * @param stopParser :IParser<any> defines if text stops at the end of line
 * @returns Parser
 */
export function formattedSequence(
    pureTextParser: SingleParser<string>,
    stopParser: IParser<any>,
): SingleParser<FormattedSequence> {
    return bold()
        .or(italic())
        .or(text())
        .or(code())
        .rep()
        .then(stopParser.drop()) // could reuse formattedLine
        .array()
}

// So last eaten character could be a '\n'
export function paragraph(): SingleParser<any> {
    return formattedLine()
        .then(
            F.try(eol().drop().then(formattedLine()).single().optrep().array()),
        )
        .array()
        .map(([firstLine, otherLines]) => {
            let result = firstLine as MdText[]
            otherLines.forEach(
                (line: MdText[]) => (result = result.concat(line)),
            )

            let a = [
                { type: 'text', text: '' },
                { type: 'italic', text: 'italic' },
                { type: 'text', text: 'text' },
                [
                    { type: 'bold', text: 'then bold' },
                    { type: 'text', text: '' },
                ],
            ]
            const content = result.filter((mdText) => mdText.text.length > 0)

            return { type: 'paragraph', content }
        })
}
