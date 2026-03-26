/*
   CAT FACTS API MODULE
   Uses: catfact.ninja — public cat facts API
   Methods: GET (random fact, paginated list)
 */

const FactsAPI = (() => {

  const BASE = 'https://catfact.ninja';

  /* GET /fact — one random fact  */
  async function getRandomFact() {
    const response = await fetch(`${BASE}/fact`);
    if (!response.ok) throw new Error(`GET /fact failed: ${response.status}`);
    const data = await response.json();
    return {
      text:   data.fact,
      length: data.length,
    };
  }

  /*GET /facts?limit=N — several facts  */
  async function getFacts(limit = 5) {
    const params = new URLSearchParams({ limit });
    const response = await fetch(`${BASE}/facts?${params}`);
    if (!response.ok) throw new Error(`GET /facts failed: ${response.status}`);
    const data = await response.json();
    return (data.data || []).map(item => ({
      text:   item.fact,
      length: item.length,
    }));
  }

  return { getRandomFact, getFacts };
})();
