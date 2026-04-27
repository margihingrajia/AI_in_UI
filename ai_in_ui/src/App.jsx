import React, { useState, useRef } from "react";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([
    "Do homework",
    "Eat",
    "Sleep",
  ]);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("tasks");

  const inputRef = useRef(null);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  const addTodo = () => {
    if (input.trim() === "") {
      setError("Task cannot be empty");
      return;
    }

    setTodos([...todos, input.trim()]);
    setInput("");
    setError("");
    showMessage("Task added successfully");
    inputRef.current.focus();
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
    showMessage("Task deleted");
  };

  const completeTodo = (todo) => {
    showMessage(`Completed: "${todo}"`);
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>To Do List</h1>
        <p className="subtext">Stay organized and productive</p>
      </header>

      {/* Navigation */}
      <nav className="nav" aria-label="Main Navigation">
        <button
          className={activeTab === "tasks" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("tasks")}
        >
          Tasks
        </button>
        <button
          className={activeTab === "settings" ? "nav-btn active" : "nav-btn"}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </nav>

      {/* Feedback */}
      <div className="feedback-area">
        {message && <div className="toast success">{message}</div>}
        {error && <div className="toast error">{error}</div>}
      </div>

      {/* Main Content */}
      {activeTab === "tasks" && (
        <>
          {/* Input */}
          <div className="input-area">
            <input
              ref={inputRef}
              placeholder="Enter a new task..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              aria-label="Task input"
            />
            <button
              className="primary-btn"
              onClick={addTodo}
              disabled={input.trim() === ""}
            >
              Add Task
            </button>
          </div>

          {/* Empty State */}
          {todos.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet</p>
              <span>Add your first task above 👆</span>
            </div>
          ) : (
            /* List */
            <div className="list">
              {todos.map((todo, index) => (
                <div key={index} className="item">
                  <span className="todo-text">{todo}</span>

                  <div className="actions">
                    <button
                      className="secondary-btn"
                      onClick={() => completeTodo(todo)}
                    >
                      Complete
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => deleteTodo(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "settings" && (
        <div className="settings">
          <p>Settings panel (coming soon)</p>
        </div>
      )}
    </div>
  );
}