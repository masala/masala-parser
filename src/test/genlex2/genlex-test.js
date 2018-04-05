let addToken=charToken('add', '+').precedence(1050);
// or as POO ?
let minusToken=new CharToken('minus', '-').precedence(1050);
let dateToken = new Token('date',dateParser()).precedence(1200);

let tokens = new TokenCollectionBuilder()
    .addAll(basicTokens()) // id, number,...
    .add(dateToken())
    .addAll([addToken, minusToken])
    .changePrecedence('number', 500)
    .build();

const tkNumber = tokens.get('number');


/** Defining grammar with Parsers **/
function opToken() {
    return tokens.get('+').or(tokens.get('-'));
}

function operation(){
    return tkNumber.then(opToken()).then(tkNumber)
        .map( ([left, op, right]) => op ==='+' ? left+right : left - right );
}


/* Chaining, like Before */
function numberParser() {
    let keywords = ['*', '/', '-', '+'];
    let tokenizer = genlex
        .generator(keywords)
        .tokenBetweenSpaces(token.builder);

    return tokenizer.chain(operation());
}

/* Chaining now */
function numberParser2() {

    let tokenizer = new GenLexBuider()
        .withTokens(tokens)
        .separatedBy(basicSpaces())
        .build();

    return tokenizer.chain(operation());
}



