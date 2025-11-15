import { useState } from "react";
import CreatePlanForm from "./components/CreatePlanForm.jsx";
import DailyPlanView from "./components/DailyPlanView.jsx";
import StreakCounter from "./components/StreakCounter.jsx";
import HourlyTaskList from "./components/HourlyTaskList.jsx";
import EncouragementMessage from "./components/EncouragementMessage.jsx";
import './app.css';  

function App() {
  const [userName] = useState("Alice");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState("create");
  const [streak, setStreak] = useState(0);

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    setCurrentPage("daily");
  };

  const handlePlanCreated = async () => {
    setRefreshKey((prev) => prev + 1);

    // Fetch the newly created plan
    const response = await fetch(`/api/plans/user/${userName}`);
    const data = await response.json();

    // Sort and get newest
    const sorted = data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
    const newestPlan = sorted[0];

    // Auto-select and show
    setSelectedPlan(newestPlan);
    setCurrentPage("daily");
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>StudyFlow</h1>
        <p>Eliminate decision paralysis. Study with focus.</p>
      </div>

      <StreakCounter userName={userName} onStreakLoaded={setStreak} />
      <EncouragementMessage streak={streak} />

      <nav className="nav">
        <button
          className={`nav-button ${currentPage === "create" ? "active" : ""}`}
          onClick={() => setCurrentPage("create")}
        >
          Create Plan
        </button>
        <button
          className={`nav-button ${currentPage === "plans" ? "active" : ""}`}
          onClick={() => setCurrentPage("plans")}
        >
          My Plans
        </button>
        <button
          className={`nav-button ${currentPage === "daily" ? "active" : ""}`}
          onClick={() => setCurrentPage("daily")}
          disabled={!selectedPlan}
        >
          Today's Tasks
        </button>
      </nav>

      {currentPage === "create" && (
        <div className="card">
          <CreatePlanForm
            userName={userName}
            onPlanCreated={handlePlanCreated}
          />
        </div>
      )}

      {currentPage === "plans" && (
        <div className="card">
          <DailyPlanView
            userName={userName}
            onSelectPlan={handleSelectPlan}
            refreshTrigger={refreshKey}
          />
        </div>
      )}

      {currentPage === "daily" && selectedPlan && (
        <div className="card">
          <button
            className="btn-secondary"
            onClick={() => setCurrentPage("plans")}
          >
            ← Back to Plans
          </button>
          <h2>{selectedPlan.topic}</h2>
          <p>Deadline: {selectedPlan.deadline}</p>
          <HourlyTaskList
            tasks={selectedPlan.hourly_tasks}
            planId={selectedPlan._id}
            onAllComplete={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
