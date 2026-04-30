# Quantifying the Heuristic Gap  
### A Comparative Study of LLMs in UI/UX Fault Detection and Iterative Interface Improvement

## 📌 Overview
This repository accompanies the research study:

> **“Quantifying the Heuristic Gap: A Comparative Study of Large Language Models in UI/UX Fault Detection and Iterative Interface Improvement”**

The project investigates whether modern Large Language Models (LLMs) can replicate structured UX reasoning using **Nielsen’s usability heuristics**, and how effectively they improve interfaces through iterative prompting.

We evaluate three models:
- ChatGPT (GPT-4 class)
- Claude (Sonnet)
- GitHub Copilot

---

## 🎯 Research Objectives

This study addresses three core questions:

1. **Heuristic Detection**
   - Can LLMs accurately identify usability violations?

2. **Prompt Sensitivity**
   - How does prompt structure affect reasoning depth and output quality?

3. **Implementation Fidelity**
   - Do models translate UX insights into correct, production-level code?

---

## 🧪 Experimental Setup

### Baseline (V0)
A deliberately flawed **React To-Do App** was created with **8 usability violations**, including:
- Poor feedback (browser alerts)
- Inconsistent labeling
- No error prevention
- Missing accessibility support
- Non-functional navigation
- Poor visual design

### Iterative Prompt Pipeline

| Stage | Purpose | Output |
|------|--------|--------|
| **V1** | Heuristic Evaluation | Structured issue table |
| **V2** | Redesign Strategy | UX decisions (no code) |
| **V3** | Implementation | Production-ready React UI |

---

## 📊 Evaluation Dimensions

Each model was assessed across:

- Heuristic Coverage  
- Depth of Reasoning  
- Structural Clarity  
- Severity Calibration  
- Accessibility Compliance  
- Code Quality (V3)

---

## 🔍 Key Findings

### 1. Reliable Detection of Obvious Issues
All models consistently identified:
- Alert misuse
- Poor color contrast
- Inconsistent labels

### 2. Prompting Drives Quality More Than Model Choice
- Weak prompts → shallow results (all models)
- Strong structured prompts → high-quality outputs

### 3. Clear Model Differences at Peak Performance

| Model | Strengths | Weaknesses |
|------|----------|-----------|
| **Claude** | Best structure, accessibility, architecture | Requires detailed prompting |
| **ChatGPT** | Broad coverage, strong feature set | Occasional inconsistency between design & code |
| **Copilot** | Fast, concise, code-oriented | Weak UX reasoning, limited depth |

---

## 🧠 Code-Level Insights (V3)

### Architecture

- **Claude**
  - `useReducer` + modular components
  - Design system + tokenized CSS
  - Scalable and production-ready

- **ChatGPT**
  - ID-based state management
  - Inline editing per task
  - Clean but less modular

- **Copilot**
  - Index-based state (fragile)
  - Monolithic component
  - Minimal abstraction

---

### Accessibility Comparison

| Feature | Claude | ChatGPT | Copilot |
|--------|--------|--------|---------|
| ARIA labels | ✅ | Partial | ❌ |
| Live regions | ✅ | ❌ | ❌ |
| Keyboard support | ✅ | Partial | Minimal |
| Focus management | ✅ | Partial | ❌ |

👉 **Conclusion:** Accessibility is **not reliably handled unless explicitly prompted**

---

## 🔁 Iterative Improvement Trend

| Dimension | V1 | V2 | V3 |
|----------|----|----|----|
| Structure | Low | Medium | High |
| UX Quality | Low | Medium | High |
| Accessibility | Low | Medium | High (only with prompting) |

---

## ⚠️ Critical Insight

> **LLMs do not guarantee self-consistency across stages**

Example:
- Model recommends removing bad navigation (V2)
- Reintroduces it in code (V3)

➡️ **Implication:** Always validate implementation against design strategy.

---

## 🛠️ Practical Guidelines

For using LLMs in UX workflows:

1. **Use a 3-step pipeline**
   - Analysis → Strategy → Implementation

2. **Repeat critical requirements**
   - Especially accessibility and UX constraints

3. **Explicitly prompt accessibility**
   - Mention WCAG, ARIA, keyboard navigation

4. **Always review generated code**
   - Do not assume correctness


