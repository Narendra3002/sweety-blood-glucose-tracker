export default function ReadingTable({
  readings,
  onEdit,
  onDelete
}) {
  if (!readings.length) {
    return (
      <div className="empty">
        <div className="empty-icon">○</div>
        <h3>No readings yet</h3>
        <p>Add your first glucose reading to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time slot</th>
            <th>Glucose</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {readings.map(reading => (
            <tr key={reading.id}>
              <td>
                {String(reading.reading_date).slice(0, 10)}
              </td>
              <td>{reading.slot}</td>
              <td>
                <strong>{reading.value}</strong> mg/dl
              </td>
              <td className="actions">
                <button
                  className="small secondary"
                  onClick={() => onEdit(reading)}
                >
                  Edit
                </button>
                <button
                  className="small danger"
                  onClick={() => onDelete(reading.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
