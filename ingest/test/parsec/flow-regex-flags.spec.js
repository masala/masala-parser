import { describe, it, expect } from 'vitest';
import Streams from '../../lib/stream/index';
import { F } from '../../lib/parsec/index';

describe('F.regex – behaviour of individual RegExp flags', () => {
    /* ───────────────────────────── i : ignore-case ─────────────────────────── */
    it('i flag → matches despite case difference / no-i flag → fails', () => {
        // with i
        let stream  = Streams.ofString('ABC');
        let parsing = F.regex(/abc/i).parse(stream);
        expect(parsing.isAccepted()).toBe(true);
        expect(parsing.value).toBe('ABC');
        expect(parsing.offset).toBe(3);

        // without i
        stream  = Streams.ofString('ABC');
        parsing = F.regex(/abc/).parse(stream);
        expect(parsing.isAccepted()).toBe(false);
        expect(parsing.offset).toBe(0);
    });

    /* ───────────────────────────── s : dotAll ──────────────────────────────── */
    it('s flag → dot matches newline / no-s flag → fails', () => {
        // with s
        let stream  = Streams.ofString('a\nb');
        let parsing = F.regex(/a.b/s).parse(stream);
        expect(parsing.isAccepted()).toBe(true);
        expect(parsing.value).toBe('a\nb');
        expect(parsing.offset).toBe(3);

        // without s
        stream  = Streams.ofString('a\nb');
        parsing = F.regex(/a.b/).parse(stream);
        expect(parsing.isAccepted()).toBe(false);
    });

    /* ───────────────────────────── m : multiline anchors ───────────────────── */
    it('m flag → ^/$ see line breaks / no-m flag → fails mid-string', () => {
        const src = 'foo\nbar';                 // 'bar' starts at offset 4

        // with m
        let stream  = Streams.ofString(src);
        let parsing = F.regex(/^bar$/m).parse(stream, 4);
        expect(parsing.isAccepted()).toBe(true);
        expect(parsing.value).toBe('bar');
        expect(parsing.offset).toBe(7);         // 4 + 3

        // without m
        stream  = Streams.ofString(src);
        parsing = F.regex(/^bar$/).parse(stream, 4);
        expect(parsing.isAccepted()).toBe(false);
    });

    /* ───────────────────────────── u : unicode escapes ─────────────────────── */
    it('u flag → \\u{…} escape recognised / no-u flag → fails', () => {
        const smile = '😀';                      // U+1F600 (surrogate pair)

        // with u
        let stream  = Streams.ofString(smile);
        let parsing = F.regex(/\u{1F600}/u).parse(stream);
        expect(parsing.isAccepted()).toBe(true);
        expect(parsing.value).toBe(smile);
        expect(parsing.offset).toBe(smile.length);   // 2 code units in UTF-16

        // without u
        stream  = Streams.ofString(smile);
        parsing = F.regex(/\u{1F600}/).parse(stream);
        expect(parsing.isAccepted()).toBe(false);
    });

    it('matches only when the cursor is exactly on the pattern', () => {
        const stickyB = /b/y;

        // cursor on the b  → accepted
        let stream  = Streams.ofString('ab');
        let parsing = F.regex(stickyB).parse(stream, 1);   // start at index 1
        expect(parsing.isAccepted()).toBe(true);
        expect(parsing.value).toBe('b');
        expect(parsing.offset).toBe(2);                    // consumed one char

        // cursor before the b → rejected (sticky prevents look-ahead)
        stream  = Streams.ofString('ab');
        parsing = F.regex(stickyB).parse(stream, 0);       // start at index 0
        expect(parsing.isAccepted()).toBe(false);
        expect(parsing.offset).toBe(0);                    // untouched on failure
    });
});
