/* Array with different values*/
import type {IParser, VoidParser, Option} from "../masala-parser.d.ts";
import type {Tuple, NEUTRAL} from "./tuple.d.ts";

// A SingleParser is really a IParser that don't have weird Neutral or Void value
export interface SingleParser<T> extends IParser<T> {

    then(dropped: VoidParser): SingleParser<T>;
    then(empty: EmptyTupleParser): SingleParser<T>;

    then<Y>(otherTuple: TupleParser<Y>): MixedParser<T, Y>;
    then(sameTuple: TupleParser<T>): TupleParser<T>;
    then<FIRST, LAST>(mixed: MixedParser<FIRST, LAST>): MixedParser<T, LAST>;

    then<T>(same: SingleParser<T>): TupleParser<T>;
    then<Y>(other: SingleParser<Y>): MixedParser<T, Y>;
    then(p: IParser<T>): TupleParser<T>;
    then<Y>(p: IParser<Y>): MixedParser<T, Y>;
    /*or(other: SingleParser<T>): SingleParser<T>;
    or<Y>(other: SingleParser<Y>): SingleParser<T | Y>;
    or(other: TupleParser<T>): TupleParser<T>;
    or<Y>(other: TupleParser<Y>): TupleParser<Y> | TupleParser<T>;
    or<Y, P extends IParser<Y>>(other: P): SingleParser<T> | P;

    opt(): SingleParser<Option<T>>;

    rep(): TupleParser<T>;
    optrep(): TupleParser<T>;*/

    val(text: string): T;
}

export interface TupleParser<T> extends IParser<Tuple<T>> {
    first(): SingleParser<T>; // will be undefined
    last(): SingleParser<T>;
    then(dropped: VoidParser): TupleParser<T>;
    then(empty: EmptyTupleParser): TupleParser<T>;
    then<Y>(otherTuple: TupleParser<Y>): MixedParser<T, Y>;
    then(sameTuple: TupleParser<T>): TupleParser<T>;
    then<FIRST, LAST>(mixed: MixedParser<FIRST, LAST>): MixedParser<T, LAST>;
    then<Y>(other: SingleParser<Y>): MixedParser<T, Y>;
    then(p: IParser<T>): TupleParser<T>;
    then<Y>(p: IParser<Y>): MixedParser<T, Y>;

    /**
     * Maps the content of the tuple value into an array.
     * However, it's usually better to work directly on the Tuple, not the TupleParser
     */
    array(): SingleParser<T[]>;

    /**
     * single() is an alias of first(), expressing that the
     * parser had only a single value.
     */
    /*
    single(): SingleParser<T>;
    last(): SingleParser<T>;
    first(): SingleParser<T>;
    rep(): TupleParser<T>;
    optrep(): TupleParser<T>;

     */
    val(text: string): Tuple<T>;

}

export interface EmptyTupleParser extends TupleParser<NEUTRAL> {
    first(): SingleParser<undefined>; // will be undefined
    last(): SingleParser<undefined>;

    then(dropped: VoidParser): EmptyTupleParser;
    then(empty: EmptyTupleParser): EmptyTupleParser;

    /*
    then<Y>(other: TupleParser<Y>): TupleParser<Y>;
    then<FIRST,LAST>(other: MixedParser<FIRST, LAST>): MixedParser<FIRST, LAST>;
    then<Y>(other: SingleParser<Y>): SingleParser<Y>;
*/
}

export interface MixedParser<FIRST, LAST> extends TupleParser<FIRST | LAST | any> {

    first(): SingleParser<FIRST>;
    last(): SingleParser<LAST>;

    then(dropped: VoidParser): MixedParser<FIRST, LAST>;
    then(empty: EmptyTupleParser): MixedParser<FIRST, LAST>;

    then<Y>(other: TupleParser<Y>): MixedParser<FIRST, Y>;
    then<F, L>(other: MixedParser<F, L>): MixedParser<FIRST, L>;
    then<Y>(other: SingleParser<Y>): MixedParser<FIRST, Y>;

}