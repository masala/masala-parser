/*
 * Masala Parser
 * https://github.com/masala/masala-parser
 *
 * Copyright (c) 2016-2025 Didier Plaindoux & Nicolas Zozol
 * Licensed under the LGPL3 license.
 */

class Try {
    constructor(value, error) {
        this.value = value;
        this.error = error;
    }

    isSuccess() {
        return this.error === null;
    }

    isFailure() {
        return !this.isSuccess();
    }

    onSuccess(bindCall) {
        if (this.isSuccess()) {
            bindCall(this.value);
        }

        return this;
    }

    onFailure(bindCall) {
        if (this.isFailure()) {
            bindCall(this.error);
        }

        return this;
    }

    map(bindCall) {
        if (this.isSuccess()) {
            try {
                return success(bindCall(this.value));
            } catch (e) {
                return failure(e);
            }
        } else {
            return this;
        }
    }

    flatMap(bindCall) {
        if (this.isSuccess()) {
            try {
                return bindCall(this.value);
            } catch (e) {
                return failure(e);
            }
        } else {
            return this;
        }
    }

    success() {
        return this.value;
    }

    failure() {
        return this.error;
    }

    recoverWith(value) {
        if (this.isSuccess()) {
            return this.value;
        } else {
            return value;
        }
    }

    lazyRecoverWith(value) {
        if (this.isSuccess()) {
            return this.value;
        } else {
            return value(this.error);
        }
    }
    filter(f) {
        if (this.isSuccess()) {
            if (f(this.value)) {
                return this;
            } else {
                return failure(new Error('invalid filter'));
            }
        }

        return this;
    }
}

function success(value) {
    return new Try(value, null);
}

function failure(error) {
    return new Try(null, error);
}

export default {
    success,
    failure,
};
