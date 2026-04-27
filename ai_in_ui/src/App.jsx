import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState(["Do homework", "Eat", "Sleep"]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 2500);
  };

  const addTodo = () => {
    if (input.trim() === "") {
      showMessage("error", "Task cannot be empty.");
      return;
    }

    setTodos([...todos, input.trim()]);
    setInput("");
    showMessage("success", "Task added!");
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
    showMessage("success", "Task removed.");
  };

  return (
    <div className="app">
      <h1 className="title">To‑Do List</h1>

      <nav className="nav">
        <button className="nav-btn active">Home</button>
        <button className="nav-btn">Previous</button>
        <button className="nav-btn">Settings</button>
      </nav>

      <div className="input-area">
        <input
          aria-label="Add a new task"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="primary-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      {message.text && (
        <div className={`feedback ${message.type}`}>{message.text}</div>
      )}

      {todos.length === 0 && (
        <div className="empty-state">No tasks yet. Add your first one!</div>
      )}

      <div className="list">
        {todos.map((todo, index) => (
          <div key={index} className="item">
            <span className="task-text">{todo}</span>

            <div className="actions">
              <button className="secondary-btn">Do</button>
              <button
                className="delete-btn"
                aria-label={`Delete task: ${todo}`}
                onClick={() => deleteTodo(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
