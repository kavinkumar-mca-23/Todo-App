import { useState, useEffect } from "react";
import "../src/ToDoList.css";

function ToDoList() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [showDeleteMsg, setShowDeleteMsg] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("todo-tasks");
    if (savedTasks) {
      setTask(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(task));
  }, [task]);

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTaskObj = {
      text: newTask,
      isOn: false,
    };
    setTask([...task, newTaskObj]);
    setNewTask("");
  };

  const deleteTask = (index) => {
    const updatedTasks = task.filter((_, i) => i !== index);
    setTask(updatedTasks);
    setShowDeleteMsg(true);
    setTimeout(() => setShowDeleteMsg(false), 2000);
  };

  const toggleTaskStatus = (index, status) => {
    const updatedTasks = task.map((t, i) =>
      i === index ? { ...t, isOn: status === "on" } : t
    );
    setTask(updatedTasks);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditText(task[index].text);
  };

  const handleSaveEdit = (index) => {
    const updatedTasks = task.map((t, i) =>
      i === index ? { ...t, text: editText } : t
    );
    setTask(updatedTasks);
    setEditingIndex(null);
    setEditText("");
  };

  return (
    <div className="to-do-container">
      <h2>📝 To-Do List</h2>

      <div className="input-section">
        <input
          type="text"
          value={newTask}
          onChange={handleInputChange}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add</button>
      </div>

      {showDeleteMsg && (
        <div className="delete-msg">🗑️ Task deleted successfully!</div>
      )}

      <ul className="task-list">
        {task.map((t, index) => (
          <li key={index}>
            {editingIndex === index ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-input"
              />
            ) : (
              <span
                style={{
                  textDecoration: t.isOn ? "line-through" : "none",
                  fontWeight: "normal",
                  color: t.isOn ? "#888" : "#000",
                }}
              >
                {t.text}
              </span>
            )}

            <div className="actions">
              <label>
                <input
                  type="radio"
                  name={`status-${index}`}
                  onChange={() => toggleTaskStatus(index, "on")}
                  checked={t.isOn}
                />
                On
              </label>

              <label>
                <input
                  type="radio"
                  name={`status-${index}`}
                  onChange={() => toggleTaskStatus(index, "off")}
                  checked={!t.isOn}
                />
                Off
              </label>

              {editingIndex === index ? (
                <button onClick={() => handleSaveEdit(index)}>💾</button>
              ) : (
                <button onClick={() => handleEdit(index)}>✏️</button>
              )}

              <button onClick={() => deleteTask(index)}>❌</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="on-tasks-container">
        <h3>✅ On Tasks</h3>
        <ul>
          {task
            .filter((t) => t.isOn)
            .map((t, index) => (
              <li key={index}>{t.text}</li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;
