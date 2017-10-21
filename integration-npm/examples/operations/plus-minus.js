const {Stream, F, N, C, X} = require('@masala/parser');


const MULT = Symbol('MULT');
const PLUS = Symbol('PLUS');


//const {assertTrue} = require('../../assert');
/*
 Implementing stack solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> DAY | ( E )

 Using only one operator, simplified to:

 T -> F T'
 T' -> operator FT'  |  eps   > Now we can filter
 F -> DAY | ( T )


 Translated as pseudo-masala:

 expr -> terminal subExpr
 subExpr -> (operator terminal F.lazy(subExpr) ).opt()
 terminal -> DAY | ( F.lazy(expr) )
 */


function text() {
    return (F.not(anyOperation().or(C.charIn('()'))))
        .rep()
        .map(v => v.join('').trim());
}

function paren() {
    return C.charIn('()');
}

function token() {
    return paren().or(F.try(operation())).or(text());
}

const TM = {
    text: text(),
    token,
    PLUS,
    MULT
};


export default TM;


/*function day() {
 return C.stringIn(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']);
 }*/

function blank() {
    return C.char(' ').rep().thenReturns(' ');
}

/**
 * Operation is designed here
 */
function operation() {
    return andOperation().or(plusOperation())
}

/**
 * Designed to avoid a try on blanks
 */
function anyOperation() {
    return C.string('*').thenReturns(MULT)
        .or(C.string('+').thenReturns(PLUS));
}


function andOperation() {
    return C.string('*').thenReturns(MULT)
}

function plusOperation() {
    return C.string('+').thenReturns(PLUS)
}


function parenthesis(par) {
    return C.char(' ').optrep().drop().then(C.char(par));
}

function parenthesisExpr() {
    return parenthesis('(').then(blank().opt()).drop()
        .then(F.lazy(expr))
        .then(parenthesis(')').then(blank().opt()).drop());
}


/*
 Implementing stack solution :
 E -> T E'
 E' -> + TE'  |  eps
 T -> F T'
 T' -> * FT'  |  eps
 F -> DAY | ( E )

 E== expr
 T == subExpr
 E'== orExpr
 T' == andExpr
 F == terminal

 globalValues =[... all ...]

 expr -> subExpr then orExpr  => globalValues = merge(globalValues, left, right)
 orExpr -> (or then subExpr then F.lazy(orExpr)).opt()
 subExpr -> terminal then andExpr  =>  globalValue :filterGlobal()
 andExpr -> (and then terminal then andExpr).opt()
 terminal -> text or F.lazy(expr)


 */


/**
 * expr -> subExpr then orExpr
 * Will launch a merge
 * @param values
 */
function expr(values) {
    return subExpr().then(optionalPlusExpr())
        .map(exprValues => {
            if (exprValues.length !== 2) {
                console.log('error', exprValues);
                throw new Error('Bad size for ', exprValues + '; Expected 2:' + exprValues.length);
            }

            return 'expr';
            //return mergeOr(values, option.get());


            // return left;
        })


}


function concatOptions(singleOrArray, option) {
    if (Array.isArray(singleOrArray)) {
        if (option.isPresent()) {
            return singleOrArray.concat(option.get())
        }
        return singleOrArray;
    }
    // got single
    if (option.isPresent()) {
        if (Array.isArray(options.get())) {
            return [singleOrArray, ...options.get()];
        }
        return [singleOrArray, option.get()]
    }
    return singleOrArray;//return single value

}


/**
 * orExpr -> (or then subExpr then F.lazy(orExpr)).opt()
 */
function optionalPlusExpr() {
    return plusExpr().opt();
}

function plusExpr() {
    return plusOperation().drop().then(subExpr())
        .then(F.lazy(optionalPlusExpr))
        .map(orExprValues => {
                if (orExprValues.length !== 2) {
                    console.log('error', orExprValues);
                    throw new Error('Bad size for ', orExprValues + '; Expected 2:' + orExprValues.length);
                }
                return 'orExpr'
            }
        )
}

/**
 * subExpr -> terminal then andExpr
 * Will execute a merge
 */
function subExpr(values) {
    return terminal().debug('terminal').then(optionalMultExpr())

        .map(subExpr => {

            if (subExpr.length !== 2) {
                console.log('error', subExpr);
                throw new Error('Bad size for ', subExpr + '; Expected 2:' + subExpr.length);
            }
            return 'subExpr'
        })
}


/**
 * andExpr -> (and then terminal then andExpr).opt()
 */
function optionalMultExpr() {
    return F.nop().debug('>').then(multExpr().opt());
}

function multExpr() {
    return andOperation().debug('AND').drop().then(terminal())
        .then(F.lazy(optionalMultExpr))
        .map(andExpr => {

            if (andExpr.length !== 2) {
                console.log('error', andExpr);
                throw new Error('Bad size for ', andExpr + '; Expected 2:' + andExpr.length);
            }
            return 'andExpr'
        })
}

function merge(values, op, left, right) {
    if (op === MULT) {
        return mergeAnd(values, left, right);
    }
    return mergeOr(values, left, right);

}

function mergeAnd(values, texts) {
    return values.reduce(function (acc, value) {
        return texts.every(text => value.comment.toLowerCase().includes(text)) ? acc.concat(value) : acc
    }, []);
}

function mergeOr(values, texts) {

    return values.reduce(function (acc, value) {

        return texts.some(text => value.comment.toLowerCase().includes(text)) ? acc.concat(value) : acc
    }, []);

}


function terminal() {
    return F.try(parenthesisExpr()).or(text());
}

function filterText(values, text) {
    const inputs = values.outputs;
    let outputs = inputs.filter(input => input.comment.includes(text));
    return {inputs, outputs};
}

function combinator() {
    return expr().then(F.eos);
}


//const string = '(TUESDAY OR THURSDAY OR TUESDAY)    OR (WEDNESDAY OR (FRIDAY))';


const string = '2 + 3 * (  (   4  +   10) + ( 4) ) + 1 * -3';

let myStream = Stream.ofString(string);
let parsing = combinator().parse(myStream);
console.log(parsing.isAccepted());
console.log(parsing.offset)
console.log(parsing.offset === string.length);
console.log(parsing.value);

