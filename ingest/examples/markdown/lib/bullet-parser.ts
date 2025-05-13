/**
 * Created by Nicolas Zozol on 10/05/2019.
 */

import { F, C, SingleParser, TupleParser } from '@masala/parser'
import { formattedLine } from './text-parser.js'

import { blank, eol, spacesBlock } from './token.js'
import { BulletBlock, BulletLevel1, BulletLevel2 } from './types.js'

function stop() {
    return F.eos().or(C.charIn('\r\n*`'))
}

function pureText() {
    return F.not(stop())
        .rep()
        .map((chars) => chars.join(''))
}

function bulletLv1(): SingleParser<BulletLevel1> {
    return C.charIn('*-') //first character of a bullet is  * or -
        .then(blank()) // second character of a bullet is space or non-breakable space
        .then(formattedLine())
        .last()
        .map((someText) => ({
            type: 'bullet',
            level: 1,
            content: someText,
            children: [],
        }))
}

function bulletLv2(): SingleParser<BulletLevel2> {
    return spacesBlock(2)
        .then(blank().opt())
        .then(C.charIn('*-')) //first character of a bullet is  * or -
        .then(blank()) // second character of a bullet is space or non-breakable space
        .then(formattedLine())
        .last()
        .map((someText) => ({ type: 'bullet', level: 2, content: someText }))
}

export function bulletBlock(): SingleParser<BulletBlock> {
    const level2 = bulletLv2()
        .then(F.try(eol().drop().then(bulletLv2())).optrep())
        .array() as SingleParser<BulletLevel2[]>

    const level1 = bulletLv1() // father
        .then(
            F.try(eol().drop().then(level2))
                .opt()
                .map((o) => (o.isPresent() ? o.get() : [])),
        )
        .array()
        .map(([father, children]) => {
            return { ...father, children }
        }) as SingleParser<BulletLevel1>

    // this works:
    // const parser= bulletLv1().then(F.try(eol().drop().then(bulletLv1())).optrep());

    const parser = level1.then(
        F.try(eol().drop().then(level1)).optrep(),
    ) as TupleParser<BulletLevel1>

    return parser.array().map((bullets) => ({
        type: 'bulletBlock',
        bullets,
    }))
}

export function bullet() {
    return F.try(bulletLv2()).or(bulletLv1())
}
