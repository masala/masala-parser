import {stream, F, C, N} from '../../index';

/**
 * Created by nicorama on 10/01/2017.
 */

export default class ExtractorBundle {

    constructor(options) {
        this.options ={
            spacesCharacters:' \n',
            wordSeparators:C.charIn(' \n:-,;'),
            letters : C.letters
        };

        if (options && typeof options ==='object'){
            Object.assign(this.options, options);
        }
        
    }


    spaces() {
        return C.charIn(this.options.spacesCharacters).rep()
            .map(spaces => spaces.join(''));
    }




    // returns a types number
    number() {
        return N.digit.rep().map(v=>parseInt(v.join('')));
    }

    // returns a string representing numbers
    digits() {
        return N.digit.rep().map(v=>v.join(''));
    }

    word(which){ //parser, string or array of string
        if (which && typeof which ==='string'){
            // thenReturns word
            // or fail
        }
        return this.options.letters.rep();
    }

    _wordSeparators(moreSeparators) {
        //TODO : replace second element by moreSeparators
        return this.spaces().or(this.options.wordSeparators);
    }

    words() {
        return F.try(this.options.letters.or(this._wordSeparators())).rep();
    }

    stringIn(array) {

        const tryString = s => F.try(C.string(s));

        if (array.length === 0) {
            return tryString('').thenReturns(undefined);
        }
        if (array.length === 1) {
            return F.try(C.string(array[0]));
        }

        const initial = tryString(array[0]);
        const workArray = array.slice(1);
        return workArray.reduce((accu, next)=>accu.or(tryString(next)),
            initial)
    }

    wordsIn(array){
        // words and spaces
    }


    _wordSequence(stop) {
        //return P.any.rep();
        return F.not(stop);
    }


    wordsUntil(stop) {
        return F.try(
            this._wordSequence(stop).rep().then(F.eos).thenReturns(undefined)
        ).or(
            this._wordSequence(stop).rep().map(chars=>chars.join(''))
            )
            .filter(v=> v !== undefined);
    }
    
}


function spaces() {
    return C.charIn(' \n').rep();
}


function wordSeparators(moreSeparators) {
    //TODO : replace second element by moreSeparators
    return spaces().or(C.charIn(' \n:-,;'));
}

function number() {
    return N.digit.rep().map(v=>parseInt(v.join('')));
}

// avoid to join numbers
function dateDigits() {
    return N.digit.rep().map(v=>v.join(''));
}

function simpleWords() {
    return F.try(C.letters.or(wordSeparators())).rep();
}

// Don't panic, it will be part of standard Parsec
function stringIn(array) {

    const tryString = s => F.try(C.string(s));

    if (array.length === 0) {
        return tryString("").thenReturns(undefined);
    }
    if (array.length === 1) {
        return F.try(C.string(array[0]));
    }

    const initial = tryString(array[0]);
    const workArray = array.slice(1);
    return workArray.reduce((accu, next)=>accu.or(tryString(next)),
        initial)
}


function wordSequence(stop) {
    //return P.any.rep();
    return F.not(stop);

}

// Don't panic, it will be part of standard Parsec
function wordsUntil(stop) {
    return F.try(
        wordSequence(stop).rep().then(F.eos).thenReturns(undefined)
    ).or(
        wordSequence(stop).rep().map(chars=>chars.join(''))
        )
        .filter(v=> v !== undefined);
}

function date() {
    return dateDigits()
        .then(C.charIn('-/').thenReturns('-'))
        .then(dateDigits())
        .then(C.charIn('-/').thenReturns('-'))
        .then(dateDigits())
        .flattenDeep()
        .map(dateValues=>dateValues[4] > 2000 ? dateValues.reverse() : dateValues)
        .map(dateArray=>dateArray.join(''));
}

function canonicalDateSearch() {
    return C.string("Du ").or(C.string("du "))
        .thenRight(date())
        .thenLeft(C.string(" au "))
        .then(date());
}

function extract(combinator, msgToParse) {
    try {
        const parsing = combinator.parse(stream.ofString(msgToParse, 0));
        // console.log(parsing.value);
        return parsing.value;
    } catch (e) {
        console.info('EXCEPTION', e);
        throw e;
    }
}
