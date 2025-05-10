import {IParser, Unit} from "../masala-parser.js";
import type {SingleParser} from "./tuple-parser.js";
import type {VoidParser} from "./void-parser.js";
import type {parserBuilder, Predicate} from "../masala-parser.js";

export interface FlowBundle {
    parse<Y, P extends IParser<Y>>(parser: P): P;

    nop(): VoidParser;

    layer<Y, P extends IParser<Y>>(parser: P): P;

    try<Y, P extends IParser<Y>>(parser: P): P;

    any(): SingleParser<any>;

    subStream(length: number): VoidParser;

    not<Y, P extends IParser<Y>>(parser: P): SingleParser<any>;

    lazy<Y, P extends IParser<Y>>(builder: parserBuilder<Y, P>, args?: any[]): P;

    returns<T>(value: T): SingleParser<T>;

    error(): VoidParser;

    eos(): SingleParser<Unit>;

    satisfy<V>(predicate: Predicate<V>): SingleParser<any>;

    startWith<V>(value: V): SingleParser<V>;

    /**
     * moveUntil moves the offset until stop is found and returns the text found between.
     * The *stop* is **not** read
     * @param stop
     */
    moveUntil(stop: string): SingleParser<string>;

    moveUntil(stops: string[]): SingleParser<string>;

    moveUntil<Y>(p: IParser<Y>): SingleParser<string>;

    /**
     * Move until the stop, stop **included**, and drops it.
     * @param s
     */
    dropTo(s: string): VoidParser;

    dropTo<Y>(p: IParser<Y>): VoidParser;

    /**
     * It works only with a stream of string. Don't use it with a stream of tokens.
     * @param regex
     */
    regex(regex: RegExp): SingleParser<string>;

}