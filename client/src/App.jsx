import { useEffect, useState } from "react";
import api from "./api";
import Auth from "./components/Auth";
import ReadingForm from "./components/ReadingForm";
import ReadingTable from "./components/ReadingTable";
import ReportPanel from "./components/ReportPanel";

export default function App() {
  const [user, setUser] = useState(null);
  const [readings, setReadings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReadings = async () => {
    const response = await api.get(
      "/readings?page=1&limit=100"
    );
    setReadings(response.data.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("sweety_token");

    if (token) {
      loadReadings().catch(() => {
        localStorage.removeItem("sweety_token");
      });
    }
  }, []);

  const login = async loggedInUser => {
    setUser(loggedInUser);
    await loadReadings();
  };

  const saveReading = async data => {
    setLoading(true);
    setFormError("");

    try {
      if (editing) {
        await api.put(`/readings/${editing.id}`, data);
        console.log("EDIT ID:", editing.id, "DATA:", data);
      } else {
        await api.post("/readings", data);
      }

      setEditing(null);
      await loadReadings();
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
        "Unable to save reading."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteReading = async id => {
    if (!window.confirm("Delete this reading?")) {
      return;
    }

    try {
      await api.delete(`/readings/${id}`);
      await loadReadings();
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
        "Unable to delete reading."
      );
    }
  };

  const loadReport = async type => {
    try {
      const response = await api.get(
        `/reports/${type}?date=${date}`
      );
      setReport(response.data);
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
        "Unable to load report."
      );
    }
  };

  const logout = () => {
    localStorage.removeItem("sweety_token");
    setUser(null);
    setReadings([]);
    setReport(null);
  };

  if (!localStorage.getItem("sweety_token") || !user) {
    return <Auth onAuthenticated={login} />;
  }

  return (
    <main>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark small">S</div>
            <div>
              <strong>Sweety</strong>
              <span>Blood Glucose Tracker</span>
            </div>
          </div>

          <div className="user-area">
            <span>
              Hi, <strong>{user.name}</strong>
            </span>
            <button
              className="secondary"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="page">
        <section className="hero">
          <div>
            <p className="eyebrow">TODAY'S HEALTH LOG</p>
            <h1>Keep track. Stay informed.</h1>
            <p>
              Record your glucose readings and understand
              your daily and monthly trends.
            </p>
          </div>
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h2>
                {editing
                  ? "Edit reading"
                  : "Add a glucose reading"}
              </h2>
              <p>
                Record one of your four daily time slots.
              </p>
            </div>
            {loading && (
              <span className="loading">Saving...</span>
            )}
          </div>

          <ReadingForm
            editing={editing}
            onSave={saveReading}
            onCancel={() => {
              setEditing(null);
              setFormError("");
            }}
            error={formError}
          />
        </section>

        <section className="card">
          <div className="section-heading">
            <div>
              <h2>Your readings</h2>
              <p>
                Only your own readings are displayed.
              </p>
            </div>
            <span className="count-badge">
              {readings.length} readings
            </span>
          </div>

          <ReadingTable
            readings={readings}
            onEdit={reading => {
              setFormError("");
              setEditing(reading);
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
            }}
            onDelete={deleteReading}
          />
        </section>

        <ReportPanel
          date={date}
          setDate={setDate}
          report={report}
          onLoad={loadReport}
        />

        <footer>
          Sweety · Built as a full-stack engineering assignment
        </footer>
      </div>
    </main>
  );
}
