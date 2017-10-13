import {F, C, N} from '../../index';
import response from './../../parsec/response';
import Parser from './../../parsec/parser';

/**
 * Created by nicorama on 10/01/2017.
 */

export default class ExtractorBundle {
    constructor(options) {
        this.options = {
            spacesCharacters: ' \t\n',
            wordSeparators: C.charIn(' \n:-,;'),
            letter: C.letter,
            moreSeparators: null,
        };

        Object.assign(this.options, this._handleOptions(options));

        this.last = _last;
        this.first = _first;
    }

    _handleOptions(options) {
        if (options && typeof options === 'object') {
            if (options.moreSeparators) {
                if (options.wordSeparators) {
                    console.warn(
                        'Parsec WARNING: You cannot set both options ' +
                            'wordSeparators & options.moreSeparator ; moreSeparator is ignored'
                    );
                    delete options.moreSeparator;
                } else {
                    options.wordSeparators = C.charIn(
                        ' \n:-,;' + options.moreSeparators
                    );
                }
            }
            return options;
        } else {
            return {};
        }
    }

    spaces() {
        return C.charIn(this.options.spacesCharacters)
            .rep()
            .map(spaces => spaces.join(''));
    }

    // returns a types number
    number() {
        return N.digit.rep().map(v => parseInt(v.join('')));
    }

    // returns a string representing numbers
    digits() {
        return N.digit.rep().map(v => v.join(''));
    }

    word() {
        return this.options.letter.rep().map(v => v.join(''));
    }

    _wordSeparators() {
        //TODO : replace second element by moreSeparators
        return this.spaces().or(this.options.wordSeparators);
    }

    words(keepSpaces = true) {
        if (keepSpaces) {
            return F.try(this.word().or(this._wordSeparators()))
                .rep()
                .map(item => item.array());
        } else {
            const parser = F.try(
                this._wordSeparators().optrep().thenRight(this.word())
            );
            return parser
                .rep()
                .thenLeft(this._wordSeparators().optrep())
                .map(item => item.array());
        }
    }

    wordsIn(array, keepSpaces = true) {
        if (keepSpaces) {
            return F.try(C.stringIn(array).or(this._wordSeparators()))
                .rep()
                .map(item => item.array());
        } else {
            const parser = F.try(
                this._wordSeparators().optrep().thenRight(C.stringIn(array))
            );
            return parser
                .rep()
                .thenLeft(this._wordSeparators().optrep())
                .map(item => item.array());
        }
    }

    _wordSequence(stop) {
        return F.not(stop);
    }

    wordsUntil(stop) {
        if (typeof stop === 'string') {
            return satisfyStringFast(stop);
        }

        if (Array.isArray(stop)) {
            return satisfyArrayStringFast(stop);
        }

        return F.try(
            this._wordSequence(stop).rep().then(F.eos).thenReturns(undefined)
        )
            .or(this._wordSequence(stop).rep().map(chars => chars.join('')))
            .filter(v => v !== undefined);
    }
}

function _last(values) {
    return values[values.length - 1];
}

function _first(values) {
    return values[0];
}

/**
 * Will work only if input.source is a String
 * @param string
 * @returns {Parser}
 */
function satisfyStringFast(string) {
    return new Parser((input, index = 0) => {
        if (typeof input.source !== 'string') {
            throw 'Input source must be a String';
        }

        const sourceIndex = input.source.indexOf(string, index);
        if (sourceIndex > 0) {
            return response.accept(
                input.source.substring(index, sourceIndex),
                input,
                sourceIndex,
                true
            );
        } else {
            return response.reject(input.location(index), false);
        }
    });
}

/**
 * Will work only if input.source is a String
 * Needs to be tested with ReactJS
 * @param string
 * @returns {Parser}
 */
function satisfyArrayStringFast(array) {
    return new Parser((input, index = 0) => {
        if (typeof input.source !== 'string') {
            throw 'Input source must be a String';
        }

        let sourceIndex = -1;

        let i = 0;
        while (sourceIndex < 0 && i < array.length) {
            const needle = array[i];
            sourceIndex = input.source.indexOf(needle, index);
            i++;
            if (sourceIndex > 0) {
                break;
            }
        }

        //const sourceIndex = input.source.indexOf(string, index)

        if (sourceIndex > 0) {
            return response.accept(
                input.source.substring(index, sourceIndex),
                input,
                sourceIndex,
                true
            );
        } else {
            return response.reject(input.location(index), false);
        }
    });
}
