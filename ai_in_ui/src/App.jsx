import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  const show = (message, type = "success") => {
    clearTimeout(timer.current);
    setToast({ message, type });
    timer.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, show };
}

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Do homework", done: false },
    { id: 2, text: "Eat", done: false },
    { id: 3, text: "Sleep", done: false },
  ]);
  const [input, setInput] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const { toast, show: showToast } = useToast();
  const inputRef = useRef(null);
  const nextId = useRef(4);

  const activeTodos = todos.filter((t) => !t.done);
  const doneTodos = todos.filter((t) => t.done);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: nextId.current++, text: trimmed, done: false },
      ...prev,
    ]);
    setInput("");
    showToast("Task added");
    inputRef.current?.focus();
  };

  const toggleDone = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const requestDelete = (id) => setConfirmId(id);
  const cancelDelete = () => setConfirmId(null);

  const confirmDelete = (id) => {
    setConfirmId(null);
    setRemovingId(id);
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => t.id !== id));
      setRemovingId(null);
      showToast("Task deleted", "danger");
    }, 200);
  };

  const handleAction = () => {
    showToast("Marked as in progress");
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.done));
    showToast(
      `${doneTodos.length} completed task${doneTodos.length > 1 ? "s" : ""} cleared`
    );
  };

  return (
    <div className="todo-shell">
      {/* ── Header ── */}
      <div className="todo-header">
        <h1>
          My tasks
          <span className="task-count">{activeTodos.length} active</span>
        </h1>
        <p>Stay on top of what matters.</p>
      </div>

      {/* ── Input ── */}
      <div className="input-card">
        <input
          ref={inputRef}
          className="task-input"
          placeholder="What needs doing?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          aria-label="New task"
        />
        <button
          className="add-btn"
          onClick={addTodo}
          disabled={!input.trim()}
          aria-label="Add task"
        >
          Add task
        </button>
      </div>

      {/* ── Toast ── */}
      <div className="toast-wrap" aria-live="polite">
        {toast && (
          <div className={`toast ${toast.type}`} role="status">
            <div className="toast-dot" />
            {toast.message}
          </div>
        )}
      </div>

      {/* ── List ── */}
      {todos.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="8" width="28" height="28" rx="6" stroke="#B4B2A9" strokeWidth="2" />
            <path d="M13 20h14M13 26h8" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 14h6" stroke="#B4B2A9" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>
            Nothing here yet.
            <br />
            Add your first task above.
          </p>
        </div>
      ) : (
        <div className="todo-list" role="list">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={[
                "todo-item",
                todo.done ? "completed" : "",
                removingId === todo.id ? "removing" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="listitem"
            >
              {/* Checkbox */}
              <button
                className={`check-btn${todo.done ? " checked" : ""}`}
                onClick={() => toggleDone(todo.id)}
                aria-label={todo.done ? "Mark as active" : "Mark as done"}
                aria-pressed={todo.done}
              >
                <svg
                  className="check-icon"
                  width="11"
                  height="9"
                  viewBox="0 0 11 9"
                  fill="none"
                >
                  <path
                    d="M1 4.5L4 7.5L10 1"
                    stroke="#fff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Text */}
              <span className="todo-text">{todo.text}</span>

              {/* Actions or inline confirm */}
              {confirmId === todo.id ? (
                <div className="confirm-row">
                  <span className="confirm-label">Delete?</span>
                  <button
                    className="confirm-yes"
                    onClick={() => confirmDelete(todo.id)}
                  >
                    Yes
                  </button>
                  <button className="confirm-no" onClick={cancelDelete}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="item-actions">
                  <button
                    className="action-btn btn-do"
                    onClick={handleAction}
                    aria-label="Mark as in progress"
                  >
                    Mark doing
                  </button>
                  <button
                    className="action-btn btn-delete"
                    onClick={() => requestDelete(todo.id)}
                    aria-label={`Delete "${todo.text}"`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      {doneTodos.length > 0 && (
        <div className="todo-footer">
          <span className="footer-note">{doneTodos.length} completed</span>
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
}