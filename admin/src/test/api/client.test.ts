import { describe, it, expect, beforeEach } from 'vitest';
import { getAuthHeaders } from '../../api/client';

describe('client.ts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('getAuthHeaders retourne un objet vide sans token', () => {
    expect(getAuthHeaders()).toEqual({});
  });
});
