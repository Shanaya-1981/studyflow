import { useState } from "react";
import PropTypes from "prop-types";

function CreatePlanForm({ userName, onPlanCreated }) {
  const [topic, setTopic] = useState("");
  const [courseUrl, setCourseUrl] = useState("");
  const [deadline, setDeadline] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [startTime, setStartTime] = useState("09:00");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        course_url: courseUrl,
        deadline,
        hours_per_day: parseInt(hoursPerDay),
        user_name: userName,
        start_time: useCustomTime ? startTime : null,
      }),
    });

    await response.json();

    setTopic("");
    setCourseUrl("");
    setDeadline("");
    setHoursPerDay(2);

    onPlanCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Your Study Sprint</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="topic">
          What do you need to learn?
        </label>
        <input
          id="topic"
          name="topic"
          className="form-input"
          type="text"
          placeholder="e.g., MongoDB, React Hooks, Express"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="courseUrl">
          Course URL (optional)
        </label>
        <input
          id="courseUrl"
          name="courseUrl"
          className="form-input"
          type="url"
          placeholder="https://udemy.com/course-name or YouTube link"
          value={courseUrl}
          onChange={(e) => setCourseUrl(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="deadline">
          Deadline
        </label>
        <input
          id="deadline"
          name="deadline"
          className="form-input"
          type="date"
          min={
            new Date(new Date().setDate(new Date().getDate() - 1))
              .toISOString()
              .split("T")[0]
          }
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="hoursPerDay">
          Study hours available per day (1-8 hours)
        </label>
        <input
          id="hoursPerDay"
          name="hoursPerDay"
          className="form-input"
          type="number"
          min="1"
          max="8"
          value={hoursPerDay}
          onChange={(e) => setHoursPerDay(e.target.value)}
        />
        <small style={{ color: "#718096" }}>
          Be realistic - quality over quantity!
        </small>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={useCustomTime}
            onChange={(e) => setUseCustomTime(e.target.checked)}
          />{" "}
          I want to choose my study time
        </label>
      </div>

      {useCustomTime && (
        <div className="form-group">
          <label className="form-label" htmlFor="startTime">
            What time do you start studying?
          </label>
          <input
            id="startTime"
            name="startTime"
            className="form-input"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
      )}
      <button type="submit" className="btn-primary">
        Generate My Study Plan
      </button>
    </form>
  );
}

CreatePlanForm.propTypes = {
  userName: PropTypes.string.isRequired,
  onPlanCreated: PropTypes.func.isRequired,
};

export default CreatePlanForm;
