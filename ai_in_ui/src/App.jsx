import React, { useState, useEffect } from "react";
import "./index.css";

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Do homework", completed: false },
    { id: 2, text: "Eat", completed: false },
    { id: 3, text: "Sleep", completed: false },
  ]);

  const [input, setInput] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [lastDeleted, setLastDeleted] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Auto-clear feedback
  useEffect(() => {
    if (!message.text) return;
    const timer = setTimeout(() => setMessage({ type: "", text: "" }), 2500);
    return () => clearTimeout(timer);
  }, [message]);

  // Auto-clear undo
  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), 5000);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  const showMessage = (type, text) => setMessage({ type, text });

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      showMessage("error", "Task cannot be empty.");
      return;
    }
    const newTodo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };
    setTodos((prev) => [...prev, newTodo]);
    setInput("");
    showMessage("success", "Task added!");
  };

  const deleteTodo = (id) => {
    const removed = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setLastDeleted(removed);
    showMessage("success", "Task deleted.");
  };

  const undoDelete = () => {
    if (!lastDeleted) return;
    setTodos((prev) => [...prev, lastDeleted]);
    setLastDeleted(null);
    showMessage("success", "Task restored.");
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  const saveEdit = (id) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      showMessage("error", "Task cannot be empty.");
      return;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
    setEditingId(null);
    setEditValue("");
    showMessage("success", "Task updated.");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* App Shell */}
        <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">

          {/* Header */}
          <header className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-sm text-gray-500">Organize your day with clarity.</p>
            </div>

            <nav className="flex gap-2">
              <button className="nav-btn-active">Home</button>
              <button className="nav-btn">History</button>
              <button className="nav-btn">Settings</button>
            </nav>
          </header>

          {/* Input */}
          <section className="px-6 pt-5 pb-3 border-b border-gray-200">
            <div className="flex gap-3">
              <input
                aria-label="Add a new task"
                placeholder="Add a new task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="input"
              />
              <button onClick={addTodo} className="btn-primary">
                Add Task
              </button>
            </div>

            {message.text && (
              <div
                className={`feedback ${
                  message.type === "error" ? "feedback-error" : "feedback-success"
                }`}
              >
                {message.text}
              </div>
            )}
          </section>

          {/* Undo */}
          {lastDeleted && (
            <div className="undo-bar">
              <span>Task “{lastDeleted.text}” deleted.</span>
              <button onClick={undoDelete} className="undo-btn">Undo</button>
            </div>
          )}

          {/* Task List */}
          <main className="px-6 py-5">
            {todos.length === 0 ? (
              <div className="empty-state">
                <p className="font-medium text-gray-700">No tasks yet</p>
                <p className="text-sm text-gray-500">Add your first task to begin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo) => {
                  const editing = editingId === todo.id;

                  return (
                    <div
                      key={todo.id}
                      className="task-card group"
                    >
                      <div className="flex items-start gap-3 flex-1">

                        {/* Completion toggle */}
                        <button
                          onClick={() => toggleComplete(todo.id)}
                          className={`check-btn ${
                            todo.completed ? "check-btn-active" : ""
                          }`}
                        >
                          ✓
                        </button>

                        {/* Text / Edit */}
                        <div className="flex-1">
                          {editing ? (
                            <div className="flex flex-col gap-2">
                              <input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="input-sm"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(todo.id)}
                                  className="btn-primary-sm"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="btn-secondary-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p
                                className={`text-sm font-medium ${
                                  todo.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-900"
                                }`}
                              >
                                {todo.text}
                              </p>
                              <p className="text-xs text-gray-500">
                                {todo.completed ? "Completed" : "Tap to mark complete"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {!editing && (
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => startEdit(todo)}
                            className="btn-secondary-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="btn-danger-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
