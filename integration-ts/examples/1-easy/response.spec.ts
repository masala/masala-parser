import {Streams,  C} from '@masala/parser'
import { describe, it, expect } from 'vitest';

describe('Parser Response', () => {
  it('should handle fully accepted response', () => {
    let response = C.char('a').rep().parse(Streams.ofString('aaaa'));
    expect(response.value.join('')).toBe('aaaa');
    expect(response.offset).toBe(4);
    expect(response.isAccepted()).toBe(true);
    expect(response.isEos()).toBe(true);
  });

  it('should handle partially accepted response', () => {
    // Partially accepted
    let response = C.char('a').rep().parse(Streams.ofString('aabb'));
    expect(response.value.join('')).toBe('aa');
    expect(response.offset).toBe(2);
    expect(response.isAccepted()).toBe(true);
    expect(response.isEos()).toBe(false);
  });
});
