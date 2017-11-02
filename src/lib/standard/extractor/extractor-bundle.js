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


}

function _last(values) {
    return values[values.length - 1];
}

function _first(values) {
    return values[0];
}
