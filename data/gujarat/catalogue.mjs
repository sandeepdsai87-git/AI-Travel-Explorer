/* Gujarat destination catalogue adapter. No hardcoded destinations. */
export async function loadGujaratDestinations({ fetchImpl = fetch, baseUrl = './data/gujarat/' } = {}) {
  const url = new URL('destinations.json', new URL(baseUrl, globalThis.location?.href ?? 'https://example.invalid/'));
  const response = await fetchImpl(url.href);
  if (!response.ok) throw new Error(`Gujarat destinations unavailable: HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.schema_version !== 1 || !Array.isArray(payload.destinations)) {
    throw new Error('Unsupported Gujarat destinations schema');
  }
  return payload.destinations.map((item) => ({
    id: String(item.destination_id),
    name: item.display_name,
    state: item.state,
    district: item.district,
    latitude: item.latitude,
    longitude: item.longitude,
    searchNames: item.search_names ?? [item.display_name],
    source: payload.source
  }));
}

export function searchGujaratDestinations(destinations, query) {
  const needle = String(query ?? '').trim().toLocaleLowerCase();
  if (!needle) return destinations;
  return destinations.filter((item) =>
    [item.name, item.district, ...(item.searchNames ?? [])]
      .some((value) => String(value ?? '').toLocaleLowerCase().includes(needle))
  );
}
