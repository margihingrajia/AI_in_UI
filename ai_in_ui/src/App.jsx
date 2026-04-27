import React, { useState } from "react";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([
    "Do homework",
    "Eat",
    "Sleep",
  ]);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2000);
  };

  const addTodo = () => {
    if (input.trim() === "") return;

    setTodos([...todos, input]);
    setInput("");
    showMessage("Task added successfully");
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
        <p className="subtext">Manage your tasks efficiently</p>
      </header>

      {/* Feedback */}
      {message && <div className="toast">{message}</div>}

      {/* Input Section */}
      <div className="input-area">
        <input
          placeholder="Enter a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="primary-btn" onClick={addTodo}>
          Add Task
        </button>
      </div>

      {/* List */}
      <div className="list">
        {todos.length === 0 ? (
          <p className="empty">No tasks yet. Add one above 👆</p>
        ) : (
          todos.map((todo, index) => (
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
          ))
        )}
      </div>
    </div>
  );
}