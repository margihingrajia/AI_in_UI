import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState(["Do homework", "Eat", "Sleep"]);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const addTodo = () => {
    if (input.trim() === "") {
      setMessage("Please enter a task.");
      return;
    }

    setTodos([...todos, input.trim()]);
    setInput("");
    setMessage("Task added successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
    setMessage("Task removed.");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div className="app">
      <h1 className="title">To‑Do List</h1>

      <nav className="nav">
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Previous</button>
        <button className="nav-btn">Settings</button>
      </nav>

      <div className="input-area">
        <input
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="primary-btn" onClick={addTodo}>
          Add
        </button>
      </div>

      {message && <div className="feedback">{message}</div>}

      <div className="list">
        {todos.map((todo, index) => (
          <div key={index} className="item">
            <span className="task-text">{todo}</span>

            <div className="actions">
              <button className="secondary-btn">Do</button>
              <button
                className="delete-btn"
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
