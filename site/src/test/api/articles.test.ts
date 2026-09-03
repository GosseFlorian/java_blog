import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API_URL, fetchRecentArticles } from '../../api/articles';

describe('fetchRecentArticles', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls the correct API URL', async () => {
    const mockArticles = [
      {
        id: 1,
        titre: 'Test',
        contenu: 'Contenu',
        publie: true,
        date: '2024-01-01',
      },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    } as Response);

    const result = await fetchRecentArticles();

    expect(fetch).toHaveBeenCalledWith(`${API_URL}/articles/recents`);
    expect(result).toEqual(mockArticles);
  });
});
