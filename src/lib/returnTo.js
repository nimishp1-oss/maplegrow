export default function getReturnTo() {
  const raw = new URLSearchParams(window.location.search).get('returnTo');
  if (raw) {
    try {
      const url = new URL(raw, window.location.origin);
      if (url.origin === window.location.origin) return url.pathname + url.search + url.hash;
    } catch {
      // ignore invalid returnTo
    }
  }
  return '/';
}