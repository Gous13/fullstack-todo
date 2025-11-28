import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Backend API hosted on Render
  const API_BASE = process.env.REACT_APP_API_URL || "https://fullstack-backend-nyzi.onrender.com";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      await axios.post(`${API_BASE}/add`, { task });
      setTask("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      <h1 className="title">Todo Application</h1>

      <div className="input-section">
        <input
          className="input-box"
          value={task}
          placeholder="Enter task..."
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="add-btn" onClick={addTask}>
          Add
        </button>
      </div>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t.id} className="task-item">
            {t.task}
            <button className="delete-btn" onClick={() => deleteTask(t.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
