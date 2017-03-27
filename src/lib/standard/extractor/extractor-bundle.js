import { F, C, N } from '../../index';

/**
 * Created by nicorama on 10/01/2017.
 */

export default class ExtractorBundle {

    constructor(options) {
        this.options = {
            spacesCharacters: ' \t\n',
            wordSeparators: C.charIn(' \n:-,;'),
            letter: C.letter,
            moreSeparators: null
        };

        Object.assign(this.options, this._handleOptions(options));

        this.last = _last;
        this.first = _first;
    }

    _handleOptions(options) {
        if (options && typeof options === 'object') {

            if (options.moreSeparators) {
                if (options.wordSeparators) {
                    console.warn('Parsec WARNING: You cannot set both options ' +
                        'wordSeparators & options.moreSeparator ; moreSeparator is ignored');
                    delete options.moreSeparator;
                } else {
                    options.wordSeparators = C.charIn(' \n:-,;' + options.moreSeparators);
                }
            }
            return options;
        } else {
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

    word() {
        return this.options.letter.rep().map( v => v.join('') );
    }

    _wordSeparators() {
        //TODO : replace second element by moreSeparators
        return this.spaces().or(this.options.wordSeparators);
    }

    words(keepSpaces = true) {
        if (keepSpaces) {
            return F.try(this.word().or(this._wordSeparators())).rep();
        } else {
            const parser = F.try(this._wordSeparators().optrep().thenRight(this.word()));
            return parser.rep().thenLeft(this._wordSeparators().optrep());
        }

    }

    wordsIn(array, keepSpaces = true) {

        if (keepSpaces) {
            return F.try(this.stringIn(array).or(this._wordSeparators()))
                .rep();

        } else {
            const parser = F.try(this._wordSeparators().optrep().thenRight(this.stringIn(array)));
            return parser.rep().thenLeft(this._wordSeparators().optrep());
        }

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

function _last(values) {
    return values[values.length - 1];
}

function _first(values) {
    return values[0];
}

