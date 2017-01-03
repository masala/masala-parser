/**
 * Created by Simon on 15/12/2016.
 */

import P from '../parsec/parser';
import Stream from '../../lib/stream/index';
import T from './token';
import CombinedParser from '../../lib/standard/combined-parser';

import fs from 'fs'

function document(){
    return CombinedParser.validLine()
        .rep()
}

function parseDocument( stream, offset=0){
    return document().parse(Stream.ofString(stream), offset)
}

// get a file name, return a parser
function parseFile(fileName){
    fs.readFile(fileName, 'utf8', function (err,data) {
        if (err) {
            console.log("ERROR readFile")
            return console.log(err);
        }
        return parseDocument(data);
    });
}

function writeParser(parser, fileName){
    fs.writeFile(fileName, parser.value , function (err) {
        if (err) return console.log(err);
        console.log(fileName , 'has been written');
    });
}

export default {
    document,
    parseFile,
    writeParser,

    parse(stream){
        return parseDocument(stream,0);
    }
}