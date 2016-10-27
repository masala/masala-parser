import stream from '../../lib/stream/index';
import LineParser from './line-parser'
import P from '../parsec/parser';

const eol = P.char('\n');

export default class BlockParser {

    constructor(){
        this.lineParser = new LineParser();
    }

    paragraph(){
        return P.try(this.lineParser.line().rep().debug('found', true))
            .thenLeft(eol)
            .map(val => {paragraph : val})
    }

    combinator(){
        return this.paragraph();
    }

    parse(stream, offset = 0) {
        return this.combinator().parse(stream, offset);
    }

    /**
     * @string line
     */
    parseBlock(block) {
        return this.parse(stream.ofString(block));
    }

}