
/*
 * Parsec
 * https://github.com/d-plaindoux/parsec
 *
 * Copyright (c) 2016 Didier Plaindoux
 * Licensed under the LGPL2 license.
 */

import atry from '../data/try';

class Stream{

    constructor(){

    }

    // Stream 'a => number -> number
    location(index){
        return index;
    }

    // Stream 'a => number -> Try 'a
    get(index){
        try {
            if (this.endOfStream(index)) {
                return atry.failure(new Error("End of stream reached"));
            } else {
                return atry.success(this.unsafeGet(index));
            }
        } catch (e) {
            return atry.failure(e);
        }
    }
}

export default Stream;
