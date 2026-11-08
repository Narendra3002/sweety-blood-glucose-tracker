export default function ReportPanel({
  date,
  setDate,
  report,
  onLoad
}) {
  return (
    <section className="card">
      <div className="section-heading">
        <div>
          <h2>Reports</h2>
          <p>
            Review glucose statistics for a selected period.
          </p>
        </div>
      </div>

      <div className="report-toolbar">
        <label>
          Selected date
          <input
            type="date"
            value={date}
            max={new Date().toISOString().slice(0, 10)}
            onChange={e => setDate(e.target.value)}
          />
        </label>

        <div className="report-buttons">
          <button
            className="primary"
            onClick={() => onLoad("daily")}
          >
            Daily
          </button>
          <button
            className="secondary"
            onClick={() => onLoad("month-to-date")}
          >
            Month-to-date
          </button>
          <button
            className="secondary"
            onClick={() => onLoad("monthly")}
          >
            Previous month
          </button>
        </div>
      </div>

      {!report && (
        <div className="empty compact">
          Select a report above.
        </div>
      )}

      {report && (
        <>
          <div className="report-range">
            {report.type === "daily"
              ? `Daily report — ${report.date}`
              : `${report.from} → ${report.to}`}
          </div>

          <div className="stats">
            <div className="stat">
              <span>Highest</span>
              <strong>
                {report.highest ?? "—"}
              </strong>
              <small>mg/dl</small>
            </div>
            <div className="stat">
              <span>Lowest</span>
              <strong>
                {report.lowest ?? "—"}
              </strong>
              <small>mg/dl</small>
            </div>
            <div className="stat">
              <span>Average</span>
              <strong>
                {report.average ?? "—"}
              </strong>
              <small>mg/dl</small>
            </div>
            <div className="stat">
              <span>Readings</span>
              <strong>{report.count}</strong>
              <small>total</small>
            </div>
          </div>

          {report.count === 0 ? (
            <div className="empty compact">
              No readings for this period yet.
            </div>
          ) : report.readings ? (
            <div className="daily-list">
              {report.readings.map(reading => (
                <div key={reading.id}>
                  <span>{reading.slot}</span>
                  <strong>{reading.value} mg/dl</strong>
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
