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

let end = ()=>F.eos().or(T.eol());
function sharps() {
    return C.char('#').rep().map(string => ({typeOption:'sharp', level:string.array().length}));
}

// a white is a sequence of at least one space, tab or non-breakable space
function white() {
    return C.charIn(' \t\u00A0').rep();
}

function equals() {
    return C.string('===')
        .then(T.rawTextUntil(T.eol()))
        .then(T.eol())
        .returns(1); // this mean a level 1 title
}

function minuses() {
    return C.string('---')
        .then(T.rawTextUntil(T.eol()))
        .then(T.eol())
        .returns(2); // this mean a level 2 title
}

function titleSharp() {
    return sharps()
        .then(white().drop())
        .then(F.moveUntil(end()))
        .array()
        //.debug('')
        .map(([title, text]) => ({
                type:'title',
                typeOption:title.typeOption,
                level:title.level,
                text

            })
        );
}

function titleLine() {
    return T.blank().drop()
        .then(
            T.rawTextUntilChar('\r\n')
                .then(T.eol().drop())
                .then(equals().or(minuses()))
                .array()
                .map(array => ({
                    title: {
                        level: array[1],
                        text: array[0],
                    },
                }))
        )
        .single();
}

function title() {
    return titleSharp().or(titleLine());
}

export {
    titleLine,
    titleSharp,
    title
};
