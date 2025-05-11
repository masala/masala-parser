import { describe, it, expect } from 'vitest';
import Streams from '../../lib/stream/index';

describe('Array Stream Tests', () => {
    it('We can get a response from array', () => {
        const document = ['More', 'XYZ'];
        const line = Streams.ofArray(document);

        let response = line.get(0);
        expect(response.value).toBe('More');
    });

    it('We have reached out of stream', () => {
        const document = ['More', 'XYZ'];
        const line = Streams.ofArray(document);

        let out = line.endOfStream(3);
        expect(out).toBe(true);
        
        out = line.endOfStream(1);
        expect(out).toBe(false);
    });
}); 