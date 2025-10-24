import { describe, it, expect } from 'vitest'
import option from '../../lib/data/option.js'

describe('Option Data Type Tests', () => {
    it('option empty', () => {
        expect(option.none().isPresent()).toBe(false)
    })

    it('option not empty', () => {
        expect(option.some(12).isPresent()).toBe(true)
    })

    it('option empty mapped', () => {
        expect(
            option
                .none()
                .map(function (a) {
                    return a
                })
                .isPresent(),
        ).toBe(false)
    })

    it('option not empty mapped', () => {
        expect(
            option
                .some(12)
                .map(function (a) {
                    return a
                })
                .get(),
        ).toBe(12)
    })

    it('option not empty flat mapped to option', () => {
        expect(
            option
                .some(12)
                .flatMap(function (a) {
                    return option.some(a)
                })
                .get(),
        ).toBe(12)
    })

    it('option empty flat mapped', () => {
        expect(
            option
                .none()
                .flatMap(function (a) {
                    return a // This function wouldn't be called for none()
                })
                .isPresent(),
        ).toBe(false)
    })

    it('option empty or else', () => {
        expect(option.none().orElse(12)).toBe(12)
    })

    it('option not empty or else', () => {
        expect(option.some(12).orElse(14)).toBe(12)
    })

    it('option empty or lazy else', () => {
        expect(
            option.none().orLazyElse(function () {
                return 12
            }),
        ).toBe(12)
    })

    it('option not empty or lazy else', () => {
        expect(
            option.some(12).orLazyElse(function () {
                return 14
            }),
        ).toBe(12)
    })

    it('option empty filter', () => {
        expect(
            option
                .none()
                .filter(function (v) {
                    return v === 1
                })
                .isPresent(),
        ).toBe(false)
    })

    it('option not empty filter', () => {
        expect(
            option
                .some(12)
                .filter(function (v) {
                    return v === 12
                })
                .get(),
        ).toBe(12)
    })

    it('option not empty wrong filter', () => {
        expect(
            option
                .some(12)
                .filter(function (v) {
                    return v === 13
                })
                .isPresent(),
        ).toBe(false)
    })
})
