import { useEffect, useState } from "react";

const slots = [
  "Morning",
  "After breakfast",
  "After lunch",
  "After dinner"
];

export default function ReadingForm({
  editing,
  onSave,
  onCancel,
  error
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    date: today,
    slot: "Morning",
    value: ""
  });

  useEffect(() => {
    if (editing) {
      setForm({
        date: String(editing.reading_date).slice(0, 10),
        slot: editing.slot,
        value: editing.value
      });
    } else {
      setForm({
        date: today,
        slot: "Morning",
        value: ""
      });
    }
  }, [editing]);

  const submit = event => {
    event.preventDefault();

    onSave({
      ...form,
      value: form.value === "" ? "" : Number(form.value)
    });
  };

  return (
    <form onSubmit={submit} className="reading-grid">
      <label>
        Date
        <input
          type="date"
          max="9999-12-31"
          value={form.date}
          onChange={e =>
            setForm({
              ...form,
              date: e.target.value
            })
          }
          required
        />
      </label>

      <label>
        Time slot
        <select
          value={form.slot}
          onChange={e =>
            setForm({
              ...form,
              slot: e.target.value
            })
          }
        >
          {slots.map(slot => (
            <option key={slot}>{slot}</option>
          ))}
        </select>
      </label>

      <label>
        Glucose (mg/dl)
        <input
          type="number"
          min="1"
          max="1000"
          step="1"
          value={form.value}
          placeholder="e.g. 110"
          onChange={e =>
            setForm({
              ...form,
              value: e.target.value
            })
          }
        />
      </label>

      <div className="form-actions">
        <button className="primary">
          {editing ? "Update reading" : "Add reading"}
        </button>

        {editing && (
          <button
            type="button"
            className="secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="alert error form-error">
          {error}
        </div>
      )}
    </form>
  );
}