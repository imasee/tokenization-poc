import { getBrandConfigSnapshot } from './brand-store';

/** Simulated network latency (ms) for the intercepted fetch. */
const SIMULATED_LATENCY_MS = 400;

/**
 * Patches `window.fetch` so `@triparc/brand-engine`'s `withBranding()`/`fetchBrandConfigAsync()`
 * (which call `fetch(domain + '/Brand/' + brandCode)`) resolve against local mock data instead
 * of a real Branding API. Must run before `withBranding()` is invoked in main.ts.
 */
export function installMockBrandEndpoint(domain: string, brandCode: string): void {
  const targetUrl = `${domain}/Brand/${brandCode}`;
  const originalFetch = window.fetch.bind(window);

  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : input.toString();

    if (url !== targetUrl) {
      return originalFetch(input, init);
    }

    return new Promise<Response>((resolve) => {
      setTimeout(() => {
        resolve(
          new Response(JSON.stringify({ result: getBrandConfigSnapshot() }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }, SIMULATED_LATENCY_MS);
    });
  }) as typeof window.fetch;
}
