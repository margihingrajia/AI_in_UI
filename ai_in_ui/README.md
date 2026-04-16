# 📘 UI/UX AI Enhancement Study (Experimental Research)

## 🧪 Project Overview

This project explores the ability of modern AI systems such as ChatGPT and AI-assisted design tools like Figma AI to identify, interpret, and improve user interface design flaws.

The core objective is to evaluate whether AI can meaningfully enhance usability in a deliberately flawed interface while aligning with established UX principles.

This study is grounded in:
- Nielsen’s Usability Heuristics
- Iterative design improvement
- Human–AI co-design evaluation

---

## 🧠 Problem Statement

Modern UI/UX design is increasingly influenced by AI-assisted tools. However, the actual capability of AI systems to detect and correct usability flaws in real interfaces remains insufficiently studied.

This experiment investigates:

> **To what extent can AI-driven systems improve a deliberately flawed user interface while aligning with established usability principles?**

The study evaluates AI performance in:
- Detecting UX issues
- Suggesting improvements
- Enhancing usability through iterative refinement

---

## 🎯 Research Objectives

- Build a deliberately flawed baseline UI (V0)
- Apply AI-driven iterative improvements (V1, V2, V3)
- Evaluate improvements using UX heuristics
- Compare AI outputs against established usability standards

---

## 🧱 System Versions

| Version | Description |
|--------|-------------|
| V0 | Intentionally flawed UI (baseline system) |
| V1 | First AI-improved version |
| V2 | Refined AI iteration |
| V3 | Near-production UI |

---

# 💻 V0 — Baseline System (Bad UI To-Do App)

V0 is a full-page React-based to-do application intentionally designed with multiple usability violations. It serves as the experimental baseline for evaluating AI-driven UI improvements.

### Core Features:
- Add tasks
- View tasks
- Delete tasks

However, usability is intentionally degraded for research purposes.

---

## ❌ UX/UI Violations in V0

The following table maps design flaws to established UX principles such as Nielsen’s Usability Heuristics.

| UX Principle | Violation | Manifestation in V0 |
|-------------|----------|---------------------|
| Visibility of System Status | No proper feedback system | Uses `alert()` instead of UI feedback |
| Consistency & Standards | Inconsistent labeling | Buttons: “Do”, “Click”, “Go”, “X” |
| Aesthetic & Minimalist Design | Visual clutter | Red/blue colors, poor spacing |
| Recognition vs Recall | Ambiguous UI elements | Navigation labels like “Stuff”, “Things” |
| Error Prevention | No safeguards | No input validation |
| User Control & Freedom | No recovery options | No undo/edit functionality |
| Visual Hierarchy | Poor structure | No clear primary CTA |
| Accessibility | Low readability | Small fonts, poor contrast |
| Layout & Alignment | No grid system | Misaligned and cramped layout |
| Feedback Design | Non-UI feedback | Reliance on browser alerts |

---

## 🧪 V0 Implementation (React)

### 📄 `src/App.jsx`

```jsx
import { useState } from "react";

export default function App() {
  const [todos, setTodos] = useState(["Do homework", "Eat", "Sleep"]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input !== "") {
      setTodos([...todos, input]);
      setInput("");
      alert("added");
    }
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <div className="app">
      <h1>To Do</h1>

      <div className="nav">
        <span>Home</span>
        <span>Stuff</span>
        <span>Things</span>
      </div>

      <div className="inputArea">
        <input
          placeholder="Type something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTodo}>Go</button>
      </div>

      <div className="list">
        {todos.map((todo, i) => (
          <div className="item" key={i}>
            <p>{todo}</p>
            <button onClick={() => alert("doing")}>
              {i % 2 === 0 ? "Do" : "Click"}
            </button>
            <button onClick={() => deleteTodo(i)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}