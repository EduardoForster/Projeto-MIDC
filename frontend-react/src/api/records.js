// Em desenvolvimento local (fora do Docker) troque para http://localhost:8000
const API_URL = 'http://localhost:8000';

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
