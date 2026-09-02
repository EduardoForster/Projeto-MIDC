import { useEffect, useState } from 'react';
import { fetchRecords, fetchSummary } from './api/records';
import SummaryCards from './components/SummaryCards';
import DeliveriesChart from './components/DeliveriesChart';
import RecordsTable from './components/RecordsTable';

export default function App() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    async function load() {
      try {
        const [recordsData, summaryData] = await Promise.all([
          fetchRecords(),
          fetchSummary(),
        ]);
        setRecords(recordsData);
        setSummary(summaryData);
        setStatus('ready');
      } catch (err) {
        setStatus('error');
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Painel de Indicadores de Funcionários
        </h1>

        {status === 'loading' && <p className="text-gray-500">Carregando dados...</p>}

        {status === 'error' && (
          <p className="text-red-600">
            Não foi possível carregar os dados. Verifique se a API está rodando.
          </p>
        )}

        {status === 'ready' && (
          <>
            <SummaryCards summary={summary} />
            <DeliveriesChart records={records} />
            <RecordsTable records={records} />
          </>
        )}
      </div>
    </div>
  );
}
