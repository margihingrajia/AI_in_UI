import React, { useState, useRef } from "react";
import "./index.css";

export default function App() {
  const [todos, setTodos] = useState([
    { text: "Do homework", completed: false },
    { text: "Eat", completed: false },
    { text: "Sleep", completed: false },
  ]);

  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [lastDeleted, setLastDeleted] = useState(null);

  const inputRef = useRef(null);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2500);
  };

  // Add Task
  const addTodo = () => {
    if (!input.trim()) return;

    setTodos([...todos, { text: input.trim(), completed: false }]);
    setInput("");
    showMessage("Task added");
    inputRef.current.focus();
  };

  // Delete Task + Undo
  const deleteTodo = (index) => {
    setLastDeleted({ item: todos[index], index });

    setTodos(todos.filter((_, i) => i !== index));
    showMessage("Task deleted");
  };

  const undoDelete = () => {
    if (!lastDeleted) return;

    const updated = [...todos];
    updated.splice(lastDeleted.index, 0, lastDeleted.item);
    setTodos(updated);
    setLastDeleted(null);
    showMessage("Undo successful");
  };

  // Complete Task
  const toggleComplete = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  // Edit Task
  const startEdit = (index) => {
    setEditingIndex(index);
    setInput(todos[index].text);
    inputRef.current.focus();
  };

  const saveEdit = () => {
    if (!input.trim()) return;

    const updated = [...todos];
    updated[editingIndex].text = input.trim();

    setTodos(updated);
    setEditingIndex(null);
    setInput("");
    showMessage("Task updated");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-gray-900">
            Task Manager
          </h1>
          <p className="text-gray-500 mt-1">
            Stay organized and get things done
          </p>
        </header>

        {/* Feedback */}
        {message && (
          <div className="mb-4 text-sm text-center text-blue-600 bg-blue-50 py-2 rounded-lg transition">
            {message}
          </div>
        )}

        {/* Undo */}
        {lastDeleted && (
          <div className="mb-4 flex justify-between items-center bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg">
            <span>Task deleted</span>
            <button
              onClick={undoDelete}
              className="text-sm font-medium hover:underline"
            >
              Undo
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter"
                ? editingIndex !== null
                  ? saveEdit()
                  : addTodo()
                : null
            }
            placeholder="Add a new task..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <button
            onClick={editingIndex !== null ? saveEdit : addTodo}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 active:scale-95 transition"
          >
            {editingIndex !== null ? "Save" : "Add"}
          </button>
        </div>

        {/* Empty State */}
        {todos.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No tasks yet. Add one above 👆
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {todos.map((todo, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm hover:shadow-md transition"
            >
              {/* Left */}
              <div className="flex items-center gap-3">

                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(index)}
                  className="w-5 h-5 accent-blue-600 cursor-pointer"
                />

                {/* Text */}
                <span
                  className={`text-sm ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {todo.text}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">

                <button
                  onClick={() => startEdit(index)}
                  className="text-xs text-gray-500 hover:text-blue-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTodo(index)}
                  className="text-xs text-gray-500 hover:text-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}