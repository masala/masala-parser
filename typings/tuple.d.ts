export declare type NEUTRAL = symbol;
import type {Response} from "../masala-parser.d.ts";

/**
 * Represents the sequence of tokens found by the parser.
 * A Tuple accepts a `NEUTRAL` element
 */
export interface Tuple<T> {

    /**
     * Wrapped array
     */
    value: T[];

    isEmpty(): boolean;
    /**
     * Number of elements in the wrapped array
     */
    size(): number;

    /**
     * Returns the first token. It's up to the coder to know
     * if there is only one token
     *  * ```js
     *  const parser = C.char('a')
     *      .then(C.char('b'))
     *      .drop()
     *      .then(C.char('c')
     *      .single(); // Parsing will return 'c'
     * ```
     * See [[array]]
     */
    single(): T;

    /**
     * Returns all tokens in an array
     * ```js
     *  const parser = C.char('a')
     *      .then(C.char('b'))
     *      .then(C.char('c')
     *      .array(); // Parsing will return ['a','b','c']
     * ```
     * See [[single]]
     */
    array(): T[];

    /**
     * Returns the last element of the Tuple
     */
    last(): T;

    /**
     * Returns the first element of the Tuple
     */
    first(): T;

    /**
     * Returns value at index
     * @param index
     */
    at(index: number): T;

    /**
     * Join elements as one string joined by optional separator (ie empty '' separator by default)
     * @param separator join separator
     */
    join(separator?: string): string;

    append(other: Tuple<T>): Tuple<T>;
    append<Y>(other: EmptyTuple): Tuple<T>;
    append<Y>(other: Tuple<Y>): MixedTuple<T , Y>;
    append(element: T): Tuple<T>;
    append<Y>(element: Y): MixedTuple<T , Y>;


    /**
     * The tuple will not change with the NEUTRAL element.
     * It will concatenate the two tuples as one, or add
     * a single element if it's not a Tuple.
     * Therefore a Tuple can wrap multiple arrays.
     * @param neutral : neutral element
     *
     * See [[TupleParser]]
     */
    append(neutral: NEUTRAL): this;


}

export interface EmptyTuple extends Tuple<NEUTRAL> {
    append(neutral: NEUTRAL): this;
    append(other: EmptyTuple): EmptyTuple;
    append<F,L>(other: MixedTuple<F,L>): MixedTuple<F,L>;
    append<Y>(other: Tuple<Y>): Tuple<Y>;
    append<Y>(element: Y): Tuple<Y>;

}

export interface MixedTuple<FIRST, LAST> extends Tuple<FIRST |LAST |any> {
    first(): FIRST;
    last(): LAST;
    append(other: EmptyTuple): this;
    append<F,L>(other: MixedTuple<F,L>): MixedTuple<FIRST, L>;
    append<Y>(other: Tuple<Y>): MixedTuple<FIRST, Y>;
    append<Y>(element: Y): MixedTuple<FIRST , Y>;
    append(neutral: NEUTRAL): this;
}
