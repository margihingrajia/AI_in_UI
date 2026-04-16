import { useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([
    "Do homework",
    "Eat",
    "Sleep",
  ]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input !== "") {
      setTodos([...todos, input]);
      setInput("");
      alert("added"); // bad feedback
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <h1>To Do</h1>

      {/* Bad Navigation */}
      <div className="nav">
        <span>Home</span>
        <span>Previous</span>
        <span>Settings</span>
      </div>

      {/* Input Section */}
      <div className="input-area">
        <input
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTodo}>Go</button>
      </div>

      {/* Todo List */}
      <div className="list">
        {todos.map((todo, index) => (
          <div key={index} className="item">
            <p>{todo}</p>

            {/* Random inconsistent buttons */}
            <button onClick={() => alert("doing")}>
              {index % 2 === 0 ? "Do" : "Click"}
            </button>

            <button onClick={() => deleteTodo(index)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}