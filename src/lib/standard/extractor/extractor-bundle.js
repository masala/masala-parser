import {stream, F, C, N} from '../../index';

/**
 * Created by nicorama on 10/01/2017.
 */

export default class ExtractorBundle {

    constructor(options) {
        this.options ={
            spacesCharacters:' \n',
            wordSeparators:C.charIn(' \n:-,;'),
            letters : C.letters,
            moreSeparators: null
        };

        Object.assign(this.options, this._handleOptions(options));
    }

    _handleOptions(options){
        if (options && typeof options ==='object'){

            if (options.moreSeparators){
                if(options.wordSeparators){
                    console.warn('Parsec WARNING: You cannot set both options ' +
                        'wordSeparators & options.moreSeparator ; moreSeparator is ignored');
                    delete options.moreSeparator;
                }else{
                    options.wordSeparators = C.charIn(' \n:-,;'+options.moreSeparators);
                }
            }
            return options;
        }else{
            return {};
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
            // TODO : use tryString
            return F.try(C.string(array[0]));
        }

        // TODO: Comment reduce use
        const initial = tryString(array[0]);
        const workArray = array.slice(1);
        return workArray.reduce((accu, next)=>accu.or(tryString(next)),
            initial)
    }

    wordsIn(array, keepSpaces=true){

        if (keepSpaces){
            return F.try(this.stringIn(array).or(this._wordSeparators()))
                .rep();

        }else{
            const parser =F.try(this._wordSeparators().optrep().
                thenRight(this.stringIn(array)));
            return parser.rep().thenLeft(this._wordSeparators().optrep());
        }

    }


    _wordSequence(stop) {
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
