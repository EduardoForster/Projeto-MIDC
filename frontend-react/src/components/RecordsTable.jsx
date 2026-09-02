export default function RecordsTable({ records }) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-gray-500">
        Nenhum registro encontrado ainda.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Nome</th>
            <th className="px-4 py-2">Departamento</th>
            <th className="px-4 py-2">Data de referência</th>
            <th className="px-4 py-2">Entregas</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {records.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-2">{r.nome}</td>
              <td className="px-4 py-2">{r.departamento}</td>
              <td className="px-4 py-2">{r.data_referencia}</td>
              <td className="px-4 py-2">{r.quantidade_entregas}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
