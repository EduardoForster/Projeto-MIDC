import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function DeliveriesChart({ records }) {
  // Agrupa entregas por departamento — simples e suficiente para o escopo do desafio.
  const grouped = records.reduce((acc, r) => {
    acc[r.departamento] = (acc[r.departamento] ?? 0) + r.quantidade_entregas;
    return acc;
  }, {});
  const data = Object.entries(grouped).map(([departamento, total]) => ({
    departamento,
    total,
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500 mb-2">Entregas por departamento</p>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="departamento" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
