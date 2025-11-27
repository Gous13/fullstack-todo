import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

  const fetchTasks = async () => {
    const res = await axios.get(`${API_BASE}/tasks`);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!task.trim()) return;
    await axios.post(`${API_BASE}/add`, { task });
    setTask("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_BASE}/delete/${id}`);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
