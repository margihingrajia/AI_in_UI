import { useState } from "react";

export default function App() {
  const [tasks, setTasks] = useState(["Task 1", "Task 2"]);
  const [input, setInput] = useState("");

  const add = () => {
    if (input !== "") {
      setTasks([...tasks, input]);
      setInput("");
      alert("done"); // bad feedback
    }
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>

      {/* Bad Navigation */}
      <div className="nav">
        <span>Home</span>
        <span>Stuff</span>
        <span>Other</span>
      </div>

      <h2>Tasks</h2>

      {/* Task List */}
      {tasks.map((t, i) => (
        <div key={i} className="task">
          <p>{t}</p>
          <button onClick={() => alert("action")}>
            {i % 2 === 0 ? "Do" : "Go"}
          </button>
        </div>
      ))}

      <h3>Add</h3>

      {/* Bad Form */}
      <input
        placeholder="Type here"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={add}>Add</button>
    </div>
  );
}