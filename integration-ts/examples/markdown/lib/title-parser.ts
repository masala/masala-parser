/**
 * Created by Simon on 14/12/2016.
 */
/*
 * This module try parse a title. The folowing will be recognised as titles:
 * "#foo\n"  "##foo\n"  "foo\n==="  "foo\n---"  "##########     foo     \n"
 *
 * Limits and axiomes
 * A \n in the markdown source ends the parsing of a title.  #foo\nbar  -> {title:foo},{text:bar}
 */
import {F, C} from '@masala/parser'
import T from './token';

let end = () => F.eos().or(T.eol());

function sharps() {
    return C.char('#').rep().map(string => ({typeOption: 'sharp', level: string.array().length}));
}

// a white is a sequence of at least one space, tab or non-breakable space
function white() {
    return C.charIn(' \t\u00A0').rep();
}

function fat() {
    return C.string('===')
        .then(C.char('=').optrep().then(T.blank()))
        .returns(1); // this mean a level 1 title
}

function thin() {
    return C.string('---')
        .then(C.char('-').optrep().then(T.blank()))
        .returns(2); // this mean a level 2 title
}

function titleSharp() {
    return sharps()
        .then(white().drop())
        .then(F.moveUntil(end()))
        .array()
        //.debug('')
        .map(([title, text]) => ({
                type: 'title',
                typeOption: 'sharp',
                level: title.level,
                text

            })
        );
}

function titleLine() {
    return F.moveUntil(T.eol())
        .then(T.eol().drop())
        .then(fat().or(thin()))
        .array()
        .map(([text, level]) => ({
                    type: 'title',
                    level,
                    text,
                    typeOption: 'line'
                }
            )
        )

}

function title() {
    return titleSharp().or(titleLine());
}

export {
    titleLine,
    titleSharp,
    title
};
