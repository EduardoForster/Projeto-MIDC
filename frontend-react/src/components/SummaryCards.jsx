export default function SummaryCards({ summary }) {
  const cards = [
    { label: 'Total de registros', value: summary.total_registros },
    { label: 'Total de entregas', value: summary.total_entregas },
    { label: 'Média de entregas por registro', value: summary.media_entregas },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">{card.label}</p>
          <p className="text-2xl font-semibold text-gray-800">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
