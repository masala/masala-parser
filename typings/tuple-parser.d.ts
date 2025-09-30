/* Array with different values*/
import type { IParser, Option, Response } from '../masala-parser.d.ts'
import type { Tuple, NEUTRAL, MixedTuple } from './tuple.d.ts'
import type { VoidParser } from './void-parser.js'

// A SingleParser is really a IParser that don't have weird Neutral or Void value
export interface SingleParser<T> extends IParser<T> {
    then(dropped: VoidParser): TupleParser<T>
    then(empty: EmptyTupleParser): TupleParser<T>

    then(sameTuple: TupleParser<T>): TupleParser<T>
    then<Y>(otherTuple: TupleParser<Y>): MixedParser<T, Y>
    then<FIRST, LAST>(mixed: MixedParser<FIRST, LAST>): MixedParser<T, LAST>

    then(same: SingleParser<T>): TupleParser<T>
    then<Y>(other: SingleParser<Y>): MixedParser<T, Y>

    then(p: IParser<T>): TupleParser<T>
    then<Y>(p: IParser<Y>): MixedParser<T, Y>

    thenEos(): TupleParser<T>

    //or(other: SingleParser<T>): SingleParser<T>
    or<Y>(other: SingleParser<Y>): SingleParser<T | Y>
    or(other: IParser<any>): IParser<any>
    /*or(other: TupleParser<T>): TupleParser<T>;
    or<Y>(other: TupleParser<Y>): TupleParser<Y> | TupleParser<T>;
    or<Y, P extends IParser<Y>>(other: P): SingleParser<T> | P;
    */

    rep(): TupleParser<T>
    opt(): SingleParser<Option<T>>
    optrep(): TupleParser<T>

    val(text: string): T
}

export interface TupleParser<T> extends IParser<Tuple<T>> {
    first(): SingleParser<T> // will be undefined
    last(): SingleParser<T>
    single(): SingleParser<T> // alias of first()
    then(dropped: VoidParser): TupleParser<T>
    then(empty: EmptyTupleParser): TupleParser<T>
    then<Y>(otherTuple: TupleParser<Y>): MixedParser<T, Y>
    then(sameTuple: TupleParser<T>): TupleParser<T>
    then<FIRST, LAST>(mixed: MixedParser<FIRST, LAST>): MixedParser<T, LAST>
    then(other: SingleParser<T>): TupleParser<T>
    then<Y>(other: SingleParser<Y>): MixedParser<T, Y>
    then(p: IParser<T>): TupleParser<T>
    then<Y>(p: IParser<Y>): MixedParser<T, Y>

    thenEos(): this
    /**
     * Maps the content of the tuple value into an array.
     * However, it's usually better to work directly on the Tuple, not the TupleParser
     */
    array(): SingleParser<T[]>

    /**
     * Join the content of the tuple into a string, using the separator ('' by default)
     * @param separator
     */
    join(separator?: string): SingleParser<string>

    tupleMap<Y>(f: (x: T) => Y): TupleParser<Y>

    /**
     * single() is an alias of first(), expressing that the
     * parser had only a single value.
     */
    single(): SingleParser<T>

    rep(): TupleParser<T>
    /*

    last(): SingleParser<T>;
    first(): SingleParser<T>;

    optrep(): TupleParser<T>;

     */
    val(text: string): Tuple<T>

    map<Y, TUPLE extends Tuple<T>>(
        f: (value: TUPLE, response: Response<TUPLE>) => Y,
    ): SingleParser<Y>

    rep(): TupleParser<T>
    opt(): IParser<Option<Tuple<T>>>
    optrep(): TupleParser<T>

    or(other: TupleParser<T>): TupleParser<T>
    or(other: IParser<any>): IParser<any>

    val(text: string): Tuple<T>
}

export interface EmptyTupleParser extends TupleParser<NEUTRAL> {
    first(): SingleParser<undefined> // will be undefined
    last(): SingleParser<undefined>

    then<Y>(other: SingleParser<Y>): TupleParser<Y>
    then(dropped: VoidParser): EmptyTupleParser
    then(empty: EmptyTupleParser): EmptyTupleParser

    /*
    then<Y>(other: TupleParser<Y>): TupleParser<Y>;
    then<FIRST,LAST>(other: MixedParser<FIRST, LAST>): MixedParser<FIRST, LAST>;
    then<Y>(other: SingleParser<Y>): SingleParser<Y>;
*/
    or(other: EmptyTupleParser): EmptyTupleParser
    or(other: IParser<any>): IParser<any>

    val(text: string): Tuple<NEUTRAL>
}

export interface MixedParser<FIRST, LAST>
    extends TupleParser<FIRST | LAST | any> {
    first(): SingleParser<FIRST>
    last(): SingleParser<LAST>

    then(dropped: VoidParser): MixedParser<FIRST, LAST>
    then(empty: EmptyTupleParser): MixedParser<FIRST, LAST>

    then<Y>(other: TupleParser<Y>): MixedParser<FIRST, Y>
    then<F, L>(other: MixedParser<F, L>): MixedParser<FIRST, L>
    then<Y>(other: SingleParser<Y>): MixedParser<FIRST, Y>

    val(text: string): MixedTuple<FIRST, LAST>
    tupleMap<Y>(f: (x: FIRST | LAST) => Y): TupleParser<Y>

    or(other: MixedParser<FIRST, LAST>): MixedParser<FIRST, LAST>
    or(other: IParser<any>): IParser<any>

    map<Y, TUPLE extends MixedTuple<FIRST, LAST>>(
        f: (value: TUPLE, response: Response<TUPLE>) => Y,
    ): SingleParser<Y>
    map<Y, TUPLE extends Tuple<any>>(
        f: (value: TUPLE, response: Response<TUPLE>) => Y,
    ): SingleParser<Y>
}
