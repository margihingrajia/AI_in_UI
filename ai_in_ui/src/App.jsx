import React, { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const MAX_LENGTH = 120;
const MIN_LENGTH = 2;
const FILTERS = ["All", "Active", "Done"];

/* ─────────────────────────────────────────
   Hook — stacked toast notifications
───────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const show = useCallback((message, type = "success") => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, show, dismiss };
}

/* ─────────────────────────────────────────
   Hook — input validation
───────────────────────────────────────── */
function useValidation(value, existingTexts) {
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, error: null };
  if (trimmed.length < MIN_LENGTH)
    return { valid: false, error: `Task must be at least ${MIN_LENGTH} characters.` };
  if (trimmed.length > MAX_LENGTH)
    return { valid: false, error: `Task must be ${MAX_LENGTH} characters or fewer.` };
  if (existingTexts.includes(trimmed.toLowerCase()))
    return { valid: false, error: "A task with this name already exists." };
  return { valid: true, error: null };
}

/* ─────────────────────────────────────────
   NavBar
───────────────────────────────────────── */
function NavBar({ filter, onFilter, counts }) {
  return (
    <nav className="nav-bar" aria-label="Filter tasks">
      <ul className="nav-list" role="list">
        {FILTERS.map((f) => {
          const count = f === "All" ? counts.all : f === "Active" ? counts.active : counts.done;
          return (
            <li key={f}>
              <button
                className={`nav-btn${filter === f ? " nav-btn--active" : ""}`}
                onClick={() => onFilter(f)}
                aria-current={filter === f ? "page" : undefined}
              >
                {f}
                <span className="nav-badge" aria-hidden="true">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ─────────────────────────────────────────
   Toast stack
───────────────────────────────────────── */
function ToastStack({ toasts, dismiss }) {
  const icons = { success: "✓", danger: "✕", info: "ℹ" };
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role="status">
          <span className="toast-icon" aria-hidden="true">{icons[t.type] ?? "ℹ"}</span>
          <span className="toast-msg">{t.message}</span>
          <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   InputSection
───────────────────────────────────────── */
function InputSection({ onAdd, existingTexts }) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef(null);
  const errorId = "input-error-msg";

  const { valid, error } = useValidation(value, existingTexts);
  const trimmedLen = value.trim().length;
  const charLeft = MAX_LENGTH - trimmedLen;
  const nearLimit = trimmedLen > 0 && charLeft <= 20;
  const overLimit = charLeft < 0;
  const showError = touched && !!error;

  const handleSubmit = () => {
    setTouched(true);
    if (!valid) return;
    onAdd(value.trim());
    setValue("");
    setTouched(false);
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") { setValue(""); setTouched(false); }
  };

  return (
    <div className="input-section">
      <div
        className={[
          "input-card",
          showError ? "input-card--error" : "",
          valid && value ? "input-card--valid" : "",
        ].filter(Boolean).join(" ")}
      >
        <label className="sr-only" htmlFor="task-input">New task</label>
        <input
          id="task-input"
          ref={inputRef}
          className="task-input"
          type="text"
          placeholder="What needs doing?"
          value={value}
          onChange={(e) => { setValue(e.target.value); setTouched(false); }}
          onBlur={() => { if (value.trim()) setTouched(true); }}
          onKeyDown={handleKey}
          aria-describedby={showError ? errorId : "input-hint"}
          aria-invalid={showError ? "true" : undefined}
          autoComplete="off"
        />
        {trimmedLen > 0 && (
          <span
            className={`char-count${nearLimit ? " char-count--warn" : ""}${overLimit ? " char-count--over" : ""}`}
            aria-live="polite"
            aria-label={`${charLeft} characters remaining`}
          >
            {charLeft}
          </span>
        )}
        <button
          className="add-btn"
          onClick={handleSubmit}
          disabled={!value.trim()}
          aria-label="Add task"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          Add task
        </button>
      </div>

      {/* Validation / hint */}
      <div className="input-feedback" aria-live="polite">
        {showError ? (
          <span id={errorId} className="validation-error" role="alert">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5.5" stroke="#C0392B" strokeWidth="1.3"/>
              <path d="M6.5 3.8v3M6.5 8.8v.4" stroke="#C0392B" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {error}
          </span>
        ) : (
          <span id="input-hint" className="input-hint">
            Press <kbd>Enter</kbd> to add &middot; <kbd>Esc</kbd> to clear
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   TodoItem
───────────────────────────────────────── */
function TodoItem({ todo, onToggle, onDelete, onAction }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const confirmYesRef = useRef(null);

  useEffect(() => {
    if (confirmOpen) confirmYesRef.current?.focus();
  }, [confirmOpen]);

  const handleDelete = () => {
    setConfirmOpen(false);
    setRemoving(true);
    setTimeout(() => onDelete(todo.id), 220);
  };

  const handleCancelConfirm = () => setConfirmOpen(false);

  return (
    <div
      className={[
        "todo-item",
        todo.done        ? "todo-item--done"     : "",
        todo.inProgress  ? "todo-item--progress" : "",
        removing         ? "todo-item--removing" : "",
      ].filter(Boolean).join(" ")}
      role="listitem"
    >
      {/* Checkbox */}
      <button
        className={`check-btn${todo.done ? " check-btn--checked" : ""}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.done ? `Unmark "${todo.text}" as done` : `Mark "${todo.text}" as done`}
        aria-pressed={todo.done}
      >
        <svg className="check-icon" width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden="true">
          <path d="M1 5L4.5 8.5L11 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Body */}
      <div className="todo-body">
        <span className="todo-text">{todo.text}</span>
        {todo.inProgress && !todo.done && (
          <span className="progress-badge">In progress</span>
        )}
      </div>

      {/* Actions / confirm */}
      {confirmOpen ? (
        <div className="confirm-row" role="group" aria-label="Confirm deletion">
          <span className="confirm-label" id={`confirm-${todo.id}`}>Remove?</span>
          <button
            ref={confirmYesRef}
            className="confirm-btn confirm-btn--yes"
            onClick={handleDelete}
            aria-describedby={`confirm-${todo.id}`}
          >
            Remove
          </button>
          <button
            className="confirm-btn confirm-btn--no"
            onClick={handleCancelConfirm}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="item-actions">
          {!todo.done && (
            <button
              className={`action-btn btn-progress${todo.inProgress ? " btn-progress--active" : ""}`}
              onClick={() => onAction(todo.id)}
              aria-pressed={todo.inProgress}
              aria-label={
                todo.inProgress
                  ? `Unmark "${todo.text}" as in progress`
                  : `Mark "${todo.text}" as in progress`
              }
            >
              {todo.inProgress ? "Doing ✓" : "Mark doing"}
            </button>
          )}
          <button
            className="action-btn btn-delete"
            onClick={() => setConfirmOpen(true)}
            aria-label={`Delete "${todo.text}"`}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   EmptyState
───────────────────────────────────────── */
function EmptyState({ filter }) {
  const states = {
    All:    { emoji: "📋", title: "No tasks yet",        sub: "Add your first task above to get started." },
    Active: { emoji: "🎉", title: "All caught up!",      sub: "No active tasks — great work." },
    Done:   { emoji: "📌", title: "Nothing completed",   sub: "Finish a task and it will appear here." },
  };
  const s = states[filter] || states.All;

  return (
    <div className="empty-state" role="status">
      <div className="empty-emoji" aria-hidden="true">{s.emoji}</div>
      <p className="empty-title">{s.title}</p>
      <p className="empty-sub">{s.sub}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Progress ring (header)
───────────────────────────────────────── */
function ProgressRing({ done, total }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = total ? done / total : 0;

  return (
    <div className="ring-wrap" aria-label={`${Math.round(pct * 100)}% complete`} role="img">
      <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#E8E4DC" strokeWidth="4"/>
        <circle
          cx="24" cy="24" r={r}
          fill="none"
          stroke="#1D9E75"
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
          style={{ transition: "stroke-dashoffset 0.45s ease" }}
        />
      </svg>
      <span className="ring-pct" aria-hidden="true">{Math.round(pct * 100)}%</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   App
───────────────────────────────────────── */
export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Do homework",   done: false, inProgress: false },
    { id: 2, text: "Eat lunch",     done: false, inProgress: false },
    { id: 3, text: "Sleep 8 hours", done: false, inProgress: false },
  ]);
  const [filter, setFilter] = useState("All");
  const { toasts, show: showToast, dismiss } = useToast();
  const nextId = useRef(4);

  const existingTexts = todos.map((t) => t.text.toLowerCase());

  const counts = {
    all:    todos.length,
    active: todos.filter((t) => !t.done).length,
    done:   todos.filter((t) =>  t.done).length,
  };

  const filtered = todos.filter((t) => {
    if (filter === "Active") return !t.done;
    if (filter === "Done")   return  t.done;
    return true;
  });

  const addTodo = (text) => {
    setTodos((prev) => [
      { id: nextId.current++, text, done: false, inProgress: false },
      ...prev,
    ]);
    showToast(`"${text}" added`, "success");
  };

  const toggleDone = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done, inProgress: t.done ? t.inProgress : false }
          : t
      )
    );
  };

  const toggleProgress = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, inProgress: !t.inProgress } : t))
    );
  };

  const deleteTodo = (id) => {
    const todo = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    showToast(`"${todo?.text}" removed`, "danger");
  };

  const clearCompleted = () => {
    const n = counts.done;
    setTodos((prev) => prev.filter((t) => !t.done));
    showToast(`${n} completed task${n !== 1 ? "s" : ""} cleared`, "info");
  };

  return (
    <>
      {/* Skip to content — keyboard accessibility */}
      <a className="skip-link" href="#main-content">Skip to main content</a>

      <div className="app-shell">

        {/* ── Header ── */}
        <header className="app-header">
          <div className="header-top">
            <div>
              <h1 className="app-title">My Tasks</h1>
              <p className="app-sub">
                {counts.active === 0 && counts.all > 0
                  ? "All tasks complete 🎉"
                  : `${counts.active} of ${counts.all} remaining`}
              </p>
            </div>
            <ProgressRing done={counts.done} total={counts.all} />
          </div>
          <NavBar filter={filter} onFilter={setFilter} counts={counts} />
        </header>

        {/* ── Main ── */}
        <main id="main-content">
          <InputSection onAdd={addTodo} existingTexts={existingTexts} />

          <section aria-label={`${filter} tasks`}>
            {filtered.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <div className="todo-list" role="list">
                {filtered.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleDone}
                    onDelete={deleteTodo}
                    onAction={toggleProgress}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* ── Footer ── */}
        {counts.done > 0 && (
          <footer className="app-footer">
            <span className="footer-note">
              {counts.done} task{counts.done !== 1 ? "s" : ""} completed
            </span>
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* Fixed toast portal */}
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </>
  );
}