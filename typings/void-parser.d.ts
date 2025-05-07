import type {IParser} from "../masala-parser.js";
import type {EmptyTupleParser, MixedParser, SingleParser, TupleParser} from "./tuple-parser.js";

declare type MASALA_VOID_TYPE = symbol;

/**
 * Special case of a [[SingleParser]], but easier to write.
 * Note that `VoidParser.then(VoidParser)` will produce a [[TupleParser]] where
 * inner value is `[]`. Same result with `optrep()` and `rep()`
 */
export interface VoidParser extends IParser<MASALA_VOID_TYPE> {

    then(dropped: VoidParser): VoidParser;
    then(empty: EmptyTupleParser): EmptyTupleParser;

    then<Y>(otherTuple: TupleParser<Y>): TupleParser<Y>;
    then<FIRST,LAST>(mixed: MixedParser<FIRST, LAST>): MixedParser<FIRST, LAST>;

    then<Y>(other: SingleParser<Y>): SingleParser<Y>;
    then<T>(p: IParser<T>): IParser<T>;

    rep(): EmptyTupleParser;

    /*
    or(other: VoidParser): VoidParser;

    or<T, P extends IParser<T>>(other: P): VoidParser | P;

    opt(): IParser<Option<MASALA_VOID_TYPE>>;


    // Accepted with one or more occurrences.Will produce an Tuple of at least one T
    rep(): VoidParser;

    // Accepted with zero or more occurrences. Will produce a Tuple of zero or more T
    //optrep(): VoidParser;
*/

}
