import { describe, it, expect } from 'vitest'
import atry from '../../lib/data/try.js'

describe('Try Data Type Tests', () => {
    it('atry success', () => {
        expect(atry.success(1).isSuccess()).toBe(true)
    })

    it('atry failure', () => {
        expect(atry.failure(new Error('failure')).isFailure()).toBe(true)
    })

    it('atry success map can be a success', () => {
        expect(
            atry
                .success(1)
                .map((i) => i + 1)
                .isSuccess(),
        ).toBe(true)
    })

    it('atry success map can be a failure', () => {
        expect(
            atry
                .success(1)
                .map(() => {
                    throw new Error('test error')
                })
                .isFailure(),
        ).toBe(true)
    })

    it('atry success map', () => {
        expect(
            atry
                .success(1)
                .map((i) => i + 1)
                .success(),
        ).toBe(2)
    })

    it('atry failure map is a failure', () => {
        expect(
            atry
                .failure(new Error('failure'))
                .map((i) => i + 1) // This map function won't be executed
                .isFailure(),
        ).toBe(true)
    })

    it('atry failure map', () => {
        const failureValue = new Error('original failure')
        expect(
            atry
                .failure(failureValue)
                .map((i) => i + 1) // This map function won't be executed
                .failure(),
        ).toBe(failureValue)
    })

    it('atry success flatMap of atry', () => {
        expect(
            atry
                .success(1)
                .flatMap((i) => atry.success(i + 1))
                .success(),
        ).toBe(2)
    })

    it('atry failure flatMap of atry (original name: atry failure flatMap of int)', () => {
        const failureValue = new Error('original failure')
        expect(
            atry
                .failure(failureValue)
                .flatMap((i) => atry.success(i + 1)) // This function won't be executed
                .failure(),
        ).toBe(failureValue)
    })

    it('atry success flatMap that throws (original name: atry failure flatMap of Error)', () => {
        const errorThrown = new Error('flatMap error')
        const result = atry.success(1).flatMap(() => {
            throw errorThrown
        })
        expect(result.isFailure()).toBe(true)
        expect(result.failure()).toBe(errorThrown)
    })

    it('atry success recoverWith', () => {
        const result = atry.success(1).recoverWith(2)

        expect(result).toBe(1)
    })

    it('atry failure recoverWith', () => {
        expect(atry.failure(1).recoverWith(2)).toBe(2)
    })

    it('atry success lazyRecoverWith', () => {
        const result = atry.success(1).lazyRecoverWith(() => 2)
        expect(result).toBe(1)
    })

    it('atry failure lazyRecoverWith', () => {
        expect(
            atry.failure(new Error('failure')).lazyRecoverWith(() => 2),
        ).toBe(2)
    })

    it('atry success filter', () => {
        expect(
            atry
                .success(1)
                .filter((v) => v === 1)
                .isSuccess(),
        ).toBe(true)
    })

    it('atry success wrong filter', () => {
        expect(
            atry
                .success(1)
                .filter((v) => v === 2)
                .isFailure(),
        ).toBe(true)
    })

    it('atry failure filter', () => {
        const failureValue = new Error('original failure')
        const result = atry.failure(failureValue).filter((v) => v === 1) // Filter function won't be executed
        expect(result.isFailure()).toBe(true)
        expect(result.failure()).toBe(failureValue)
    })

    it('atry success onSuccess', () => {
        let success = false
        atry.success(1).onSuccess(() => {
            success = true
        })
        expect(success).toBe(true)
    })

    it('atry failure onSuccess', () => {
        let success = false
        atry.failure(new Error('failure')).onSuccess(() => {
            success = true
        })
        expect(success).toBe(false)
    })

    it('atry success onFailure', () => {
        let failure = false
        atry.success(1).onFailure(() => {
            failure = true
        })
        expect(failure).toBe(false)
    })

    it('atry failure onFailure', () => {
        let failureCallbackCalled = false
        atry.failure(new Error('failure')).onFailure(() => {
            failureCallbackCalled = true
        })
        expect(failureCallbackCalled).toBe(true)
    })
})
