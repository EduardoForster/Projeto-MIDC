// Resolve a URL da API em dev/local vs Docker:
// - em Vite podemos usar import.meta.env.VITE_API_URL (setado no compose)
// - quando em navegador local (localhost) usa http://localhost:8000
// - quando em container no compose usa http://backend:8000
const API_URL =
  import.meta?.env?.VITE_API_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : 'http://backend:8000');

export async function fetchRecords() {
  const res = await fetch(`${API_URL}/records`);
  if (!res.ok) throw new Error('Falha ao carregar os registros.');
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${API_URL}/summary`);
  if (!res.ok) throw new Error('Falha ao carregar o resumo.');
  return res.json();
}
