import { useState } from "react";
import PropTypes from "prop-types";

function HourlyTaskList({ tasks, planId, onAllComplete }) {
  const [localTasks, setLocalTasks] = useState(tasks || []);
  const [showCelebration, setShowCelebration] = useState(false);

  const celebrations = [
    "🎉 Awesome! You're crushing it!",
    "💪 Amazing work! Keep that momentum going!",
    "⭐ Fantastic! One step closer to mastery!",
  ];

  const handleCheckbox = async (index) => {
    const newTasks = [...localTasks];
    newTasks[index].completed = !newTasks[index].completed;
    setLocalTasks(newTasks);

    if (newTasks[index].completed) {
      const randomMsg =
        celebrations[Math.floor(Math.random() * celebrations.length)];
      setShowCelebration(randomMsg);
      setTimeout(() => setShowCelebration(false), 3000);
    }

    // Check if all tasks complete
    const allDone = newTasks.every((task) => task.completed);
    if (allDone && onAllComplete) {
      // Update plan status to completed
      await fetch(`/api/plans/${planId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      onAllComplete();
    }
  };

  if (!tasks || tasks.length === 0) {
    return <p>Create a NEW plan to see tasks!</p>;
  }

  return (
    <div>
      <h3>Today's Schedule</h3>
      {localTasks.map((task, index) => (
        <div key={index} className="task-item">
          <label>
            <input
              className="task-checkbox"
              type="checkbox"
              checked={task.completed || false}
              onChange={() => handleCheckbox(index)}
            />
            <strong>
              {task.time_slot}: {task.title}
            </strong>
          </label>
          <p>{task.instructions}</p>
          {task.resources &&
            task.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                📎 {res.title}
              </a>
            ))}
        </div>
      ))}

      {showCelebration && <div className="celebration">{showCelebration}</div>}
    </div>
  );
}

HourlyTaskList.propTypes = {
  tasks: PropTypes.array,
  planId: PropTypes.string.isRequired,
  onAllComplete: PropTypes.func,
};

export default HourlyTaskList;
