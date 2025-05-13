import { describe, it, expect } from 'vitest'
import option from '../../lib/data/option.js'

describe('Option Data Type Tests', () => {
    // Original test: 'option empty'
    it('option empty', () => {
        expect(option.none().isPresent()).toBe(false)
    })

    // Original test: 'option not empty'
    it('option not empty', () => {
        expect(option.some(12).isPresent()).toBe(true)
    })

    // Original test: 'option empty mapped'
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

    // Original test: 'option not empty mapped'
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

    // Original test: 'option not empty flat mapped to option'
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

    // Original test: 'option empty flat mapped'
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

    // Original test: 'option empty or else'
    it('option empty or else', () => {
        expect(option.none().orElse(12)).toBe(12)
    })

    // Original test: 'option not empty or else'
    it('option not empty or else', () => {
        expect(option.some(12).orElse(14)).toBe(12)
    })

    // Original test: 'option empty or lazy else'
    it('option empty or lazy else', () => {
        expect(
            option.none().orLazyElse(function () {
                return 12
            }),
        ).toBe(12)
    })

    // Original test: 'option not empty or lazy else'
    it('option not empty or lazy else', () => {
        expect(
            option.some(12).orLazyElse(function () {
                return 14
            }),
        ).toBe(12)
    })

    // Original test: 'option empty filter'
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

    // Original test: 'option not empty filter'
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

    // Original test: 'option not empty wrong filter'
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
