import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ══════════════════════════════════════════
   Design tokens (inline Tailwind + custom)
══════════════════════════════════════════ */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap";

const GLOBAL_CSS = `
@import url('${FONT_URL}');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sand: #F5F2EB;
  --sand-2: #EDE9DF;
  --sand-3: #DDD9CF;
  --ink: #1C1A14;
  --ink-2: #5A5750;
  --ink-3: #9C9890;
  --violet: #5448D4;
  --violet-hover: #3E33C0;
  --violet-light: #EEECFD;
  --violet-border: #C8C3F7;
  --jade: #12866A;
  --jade-light: #DEF2EB;
  --jade-border: #7ECFB8;
  --amber: #A0600A;
  --amber-light: #FEF0D5;
  --amber-border: #F4C46F;
  --rose: #B83232;
  --rose-hover: #8E2222;
  --rose-light: #FBEAEA;
  --rose-border: #F0AAAA;
  --surface: #FFFFFF;
  --r-sm: 8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 24px;
  --ease: cubic-bezier(0.22,1,0.36,1);
}

body {
  font-family: 'DM Sans', system-ui, sans-serif;
  background: var(--sand);
  color: var(--ink);
  min-height: 100svh;
  -webkit-font-smoothing: antialiased;
}

.sr-only {
  position: absolute; width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--sand-3); border-radius: 99px; }

/* ── Focus ── */
:focus-visible {
  outline: 2px solid var(--violet);
  outline-offset: 2px;
  border-radius: var(--r-sm);
}
:focus:not(:focus-visible) { outline: none; }

/* ── List reset ── */
ul, ol { list-style: none; }

/* ── Transitions ── */
.transition-fast { transition: all 0.13s var(--ease); }
.transition-base { transition: all 0.18s var(--ease); }

/* ── Item entrance ── */
@keyframes itemIn {
  from { opacity: 0; transform: translateY(10px) scale(0.99); }
  to   { opacity: 1; transform: translateY(0)   scale(1); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-3px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideRight {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(24px) scale(0.97); }
  to   { opacity: 1; transform: translateX(0)    scale(1); }
}
@keyframes toastOut {
  to { opacity: 0; transform: translateX(24px) scale(0.97); }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60%  { transform: translateX(-4px); }
  40%,80%  { transform: translateX(4px); }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes checkPop {
  0%   { transform: scale(0.6); }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.item-enter { animation: itemIn 0.22s var(--ease) both; }
.fade-in    { animation: fadeIn 0.18s var(--ease) both; }
.slide-right{ animation: slideRight 0.16s var(--ease) both; }
.shake      { animation: shake 0.32s var(--ease); }
.check-pop  { animation: checkPop 0.28s var(--ease); }

/* ── Todo item removing ── */
.removing {
  opacity: 0 !important;
  transform: translateX(16px) scale(0.98) !important;
  pointer-events: none;
  transition: all 0.22s var(--ease) !important;
}

/* ── Editable input inline ── */
.edit-input {
  font-family: 'DM Sans', system-ui, sans-serif;
  font-size: 15px;
  color: var(--ink);
  background: var(--sand);
  border: 1.5px solid var(--violet);
  border-radius: var(--r-sm);
  padding: 4px 8px;
  width: 100%;
  outline: none;
  box-shadow: 0 0 0 3px rgba(84,72,212,0.14);
}

/* ── Tooltip ── */
[data-tip] { position: relative; }
[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 11px;
  font-weight: 500;
  background: var(--ink);
  color: #fff;
  padding: 4px 9px;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.13s;
  z-index: 9999;
}
[data-tip]:hover::after { opacity: 1; }

/* ── Checkbox custom ── */
.check-wrap {
  position: relative;
  width: 22px; height: 22px; flex-shrink: 0;
}
.check-wrap input[type="checkbox"] {
  position: absolute; opacity: 0; width: 0; height: 0;
}
.check-visual {
  width: 22px; height: 22px;
  border-radius: 7px;
  border: 2px solid var(--sand-3);
  background: var(--surface);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.14s var(--ease);
}
.check-wrap input:checked ~ .check-visual {
  background: var(--jade);
  border-color: var(--jade);
}
.check-wrap input:checked ~ .check-visual svg { display: block; }
.check-visual svg { display: none; }
.check-wrap:hover .check-visual { border-color: var(--jade); background: var(--jade-light); }
.check-wrap input:checked:hover ~ .check-visual { background: #0F7260; border-color: #0F7260; }

/* ── Progress ring ── */
.ring circle.track { stroke: var(--sand-3); }
.ring circle.fill  { transition: stroke-dashoffset 0.5s var(--ease); }

/* ── Skeleton ── */
@keyframes shimmer {
  from { background-position: -400px 0; }
  to   { background-position: 400px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--sand-2) 25%, var(--sand-3) 50%, var(--sand-2) 75%);
  background-size: 800px 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--r-sm);
}

/* ── Priority dot ── */
.dot-high   { background: var(--rose); }
.dot-medium { background: var(--amber); }
.dot-low    { background: var(--jade); }
`;

/* ══════════════════════════════════════════
   Constants & helpers
══════════════════════════════════════════ */
const MAX = 120;
const MIN = 2;
const PRIORITIES = ["high", "medium", "low"];
const PRIORITY_LABELS = { high: "High", medium: "Medium", low: "Low" };
const PRIORITY_COLORS = {
  high:   { bg: "var(--rose-light)",   border: "var(--rose-border)",   text: "var(--rose)" },
  medium: { bg: "var(--amber-light)",  border: "var(--amber-border)",  text: "var(--amber)" },
  low:    { bg: "var(--jade-light)",   border: "var(--jade-border)",   text: "var(--jade)" },
};

let _id = 10;
const uid = () => ++_id;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ══════════════════════════════════════════
   Toast context
══════════════════════════════════════════ */
const ToastCtx = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const add = useCallback((msg, type = "success", undo) => {
    const id = ++counter.current;
    setToasts(p => [...p, { id, msg, type, undo, leaving: false }]);
    setTimeout(() => {
      setToasts(p => p.map(t => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300);
    }, 3800);
    return id;
  }, []);

  const dismiss = useCallback(id => {
    setToasts(p => p.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 300);
  }, []);

  return (
    <ToastCtx.Provider value={add}>
      {children}
      <ToastStack toasts={toasts} dismiss={dismiss} />
    </ToastCtx.Provider>
  );
}

const useToast = () => useContext(ToastCtx);

/* ══════════════════════════════════════════
   Toast Stack
══════════════════════════════════════════ */
const TOAST_ICONS = {
  success: (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  danger: <span style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1}}>✕</span>,
  info:   <span style={{fontSize:11,fontWeight:700,color:"#fff",lineHeight:1}}>i</span>,
};

function ToastStack({ toasts, dismiss }) {
  return (
    <div
      aria-live="polite"
      style={{
        position: "fixed", top: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 8,
        maxWidth: 340, pointerEvents: "none",
      }}
    >
      {toasts.map(t => (
        <div
          key={t.id}
          role="status"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "11px 14px",
            background: t.type === "success" ? "var(--jade-light)"
                      : t.type === "danger"  ? "var(--rose-light)"
                      : "var(--violet-light)",
            border: `1px solid ${
              t.type === "success" ? "var(--jade-border)"
            : t.type === "danger"  ? "var(--rose-border)"
            : "var(--violet-border)"}`,
            borderRadius: "var(--r-md)",
            fontSize: 13, fontWeight: 500,
            color: t.type === "success" ? "var(--jade)"
                 : t.type === "danger"  ? "var(--rose)"
                 : "var(--violet)",
            pointerEvents: "all",
            animation: t.leaving ? "toastOut 0.3s var(--ease) forwards" : "toastIn 0.2s var(--ease) both",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <span style={{
            width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: t.type === "success" ? "var(--jade)"
                      : t.type === "danger"  ? "var(--rose)"
                      : "var(--violet)",
          }}>
            {TOAST_ICONS[t.type]}
          </span>
          <span style={{ flex: 1 }}>{t.msg}</span>
          {t.undo && (
            <button
              onClick={t.undo}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 600, fontFamily: "inherit",
                color: "inherit", textDecoration: "underline",
                padding: "2px 4px", borderRadius: 4,
              }}
            >
              Undo
            </button>
          )}
          <button
            onClick={() => dismiss(t.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 16, lineHeight: 1, color: "inherit",
              opacity: 0.45, padding: "2px 4px", borderRadius: 4,
              fontFamily: "inherit",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   Input validation hook
══════════════════════════════════════════ */
function useValidation(value, existing) {
  const t = value.trim();
  if (!t) return { ok: false, error: null };
  if (t.length < MIN) return { ok: false, error: `At least ${MIN} characters needed.` };
  if (t.length > MAX) return { ok: false, error: `Keep it under ${MAX} characters.` };
  if (existing.includes(t.toLowerCase())) return { ok: false, error: "Task already exists." };
  return { ok: true, error: null };
}

/* ══════════════════════════════════════════
   Progress ring
══════════════════════════════════════════ */
function Ring({ done, total }) {
  const R = 20, CIRC = 2 * Math.PI * R;
  const pct = total ? done / total : 0;
  return (
    <div
      role="img"
      aria-label={`${Math.round(pct * 100)}% complete`}
      style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}
    >
      <svg width="52" height="52" viewBox="0 0 52 52" className="ring" aria-hidden="true">
        <circle className="track" cx="26" cy="26" r={R} fill="none" strokeWidth="4"/>
        <circle
          className="fill"
          cx="26" cy="26" r={R}
          fill="none" stroke="var(--jade)" strokeWidth="4"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
        />
      </svg>
      <span
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 500,
          color: "var(--ink-2)",
        }}
      >
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════
   Filter tabs
══════════════════════════════════════════ */
const TABS = ["All", "Active", "Doing", "Done"];

function Tabs({ active, onChange, counts }) {
  return (
    <nav aria-label="Filter tasks" style={{ borderBottom: "1.5px solid var(--sand-3)", marginBottom: 20 }}>
      <ul style={{ display: "flex", gap: 0 }}>
        {TABS.map(tab => {
          const count = tab === "All"    ? counts.all
                      : tab === "Active" ? counts.active
                      : tab === "Doing"  ? counts.doing
                      : counts.done;
          const isActive = active === tab;
          return (
            <li key={tab}>
              <button
                onClick={() => onChange(tab)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  fontFamily: "inherit", fontSize: 13, fontWeight: 500,
                  color: isActive ? "var(--violet)" : "var(--ink-2)",
                  background: "transparent", border: "none",
                  borderBottom: isActive ? "2px solid var(--violet)" : "2px solid transparent",
                  padding: "10px 14px", marginBottom: -1.5,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  borderRadius: "var(--r-sm) var(--r-sm) 0 0",
                  minHeight: 44, whiteSpace: "nowrap",
                  transition: "color 0.13s, border-color 0.13s",
                }}
              >
                {tab}
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  minWidth: 20, height: 20, padding: "0 5px",
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  background: isActive ? "var(--violet-light)" : "var(--sand-2)",
                  color: isActive ? "var(--violet)" : "var(--ink-3)",
                  borderRadius: 99,
                  transition: "background 0.13s, color 0.13s",
                }}>
                  {count}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ══════════════════════════════════════════
   Add input
══════════════════════════════════════════ */
function AddInput({ onAdd, existing }) {
  const [val, setVal] = useState("");
  const [touched, setTouched] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [shake, setShake] = useState(false);
  const ref = useRef(null);
  const { ok, error } = useValidation(val, existing);
  const trimLen = val.trim().length;
  const left = MAX - trimLen;

  const submit = () => {
    setTouched(true);
    if (!ok) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    onAdd(val.trim(), priority);
    setVal(""); setTouched(false); setPriority("medium");
    ref.current?.focus();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Main input row */}
      <div
        className={shake ? "shake" : ""}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--surface)",
          border: `1.5px solid ${
            touched && error ? "var(--rose)"
          : ok && val        ? "var(--jade)"
          : "var(--sand-3)"}`,
          borderRadius: "var(--r-lg)",
          padding: "12px 12px 12px 18px",
          boxShadow: touched && error
            ? "0 0 0 3px rgba(184,50,50,0.1)"
            : ok && val
            ? "0 0 0 3px rgba(18,134,106,0.1)"
            : "none",
          transition: "border-color 0.13s, box-shadow 0.13s",
        }}
      >
        <label className="sr-only" htmlFor="new-task">New task</label>
        <input
          id="new-task"
          ref={ref}
          type="text"
          value={val}
          autoComplete="off"
          placeholder="What needs to be done?"
          onChange={e => { setVal(e.target.value); setTouched(false); }}
          onBlur={() => { if (val.trim()) setTouched(true); }}
          onKeyDown={e => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") { setVal(""); setTouched(false); }
          }}
          style={{
            flex: 1, fontFamily: "inherit", fontSize: 15, fontWeight: 400,
            color: "var(--ink)", background: "transparent", border: "none", outline: "none",
            minWidth: 0, lineHeight: 1.5,
          }}
        />
        {/* Priority selector */}
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          aria-label="Priority"
          style={{
            fontFamily: "inherit", fontSize: 12, fontWeight: 500,
            color: PRIORITY_COLORS[priority].text,
            background: PRIORITY_COLORS[priority].bg,
            border: `1px solid ${PRIORITY_COLORS[priority].border}`,
            borderRadius: 99, padding: "3px 10px 3px 8px",
            cursor: "pointer", outline: "none", flexShrink: 0,
            appearance: "none", textAlign: "center",
          }}
        >
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
          ))}
        </select>
        {/* Char counter */}
        {trimLen > 0 && (
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: 12, flexShrink: 0,
            color: left <= 20 ? left < 0 ? "var(--rose)" : "var(--amber)" : "var(--ink-3)",
            fontWeight: left < 0 ? 600 : 400, minWidth: 28, textAlign: "right",
          }}>
            {left}
          </span>
        )}
        {/* Add button */}
        <button
          onClick={submit}
          disabled={!val.trim()}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "inherit", fontSize: 14, fontWeight: 500,
            color: !val.trim() ? "var(--ink-3)" : "#fff",
            background: !val.trim() ? "var(--sand-2)" : "var(--violet)",
            border: "none", borderRadius: "var(--r-md)",
            padding: "0 18px", height: 40, cursor: val.trim() ? "pointer" : "not-allowed",
            flexShrink: 0, whiteSpace: "nowrap",
            transition: "background 0.13s, transform 0.1s, box-shadow 0.13s",
          }}
          onMouseEnter={e => { if (val.trim()) e.currentTarget.style.background = "var(--violet-hover)"; }}
          onMouseLeave={e => { if (val.trim()) e.currentTarget.style.background = "var(--violet)"; }}
          onMouseDown={e => { e.currentTarget.style.transform = "scale(0.96)"; }}
          onMouseUp={e => { e.currentTarget.style.transform = ""; }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add
        </button>
      </div>
      {/* Feedback */}
      <div style={{ minHeight: 22, padding: "4px 4px 0", display: "flex", alignItems: "center" }}>
        {touched && error ? (
          <span
            className="fade-in"
            style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:500, color:"var(--rose)" }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <circle cx="6" cy="6" r="5" stroke="var(--rose)" strokeWidth="1.3"/>
              <path d="M6 3.5v3M6 8v.5" stroke="var(--rose)" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            {error}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>
            <kbd style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              background: "var(--sand-2)", border: "1px solid var(--sand-3)",
              borderRadius: 4, padding: "0 5px", lineHeight: 1.8, color: "var(--ink-2)",
            }}>Enter</kbd>
            {" "}to add · {" "}
            <kbd style={{
              fontFamily: "'DM Mono', monospace", fontSize: 10,
              background: "var(--sand-2)", border: "1px solid var(--sand-3)",
              borderRadius: 4, padding: "0 5px", lineHeight: 1.8, color: "var(--ink-2)",
            }}>Esc</kbd>
            {" "}to clear
          </span>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Single todo item
══════════════════════════════════════════ */
function TodoItem({ todo, onToggle, onProgress, onDelete, onEdit }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(todo.text);
  const [checkAnim, setCheckAnim] = useState(false);
  const editRef = useRef(null);
  const confirmRef = useRef(null);
  const toast = useToast();

  useEffect(() => { if (confirmOpen) confirmRef.current?.focus(); }, [confirmOpen]);
  useEffect(() => { if (editing) { editRef.current?.focus(); editRef.current?.select(); } }, [editing]);

  const handleDelete = () => {
    setConfirmOpen(false);
    setRemoving(true);
    setTimeout(() => onDelete(todo.id), 240);
  };

  const handleToggle = () => {
    setCheckAnim(true);
    onToggle(todo.id);
    setTimeout(() => setCheckAnim(false), 350);
  };

  const saveEdit = () => {
    const v = editVal.trim();
    if (v.length >= MIN && v.length <= MAX) {
      onEdit(todo.id, v);
      setEditing(false);
      toast("Task updated", "info");
    } else {
      setEditVal(todo.text);
      setEditing(false);
    }
  };

  const pc = PRIORITY_COLORS[todo.priority] || PRIORITY_COLORS.medium;

  return (
    <div
      role="listitem"
      className={removing ? "removing" : "item-enter"}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        background: todo.done ? "#FAFAF9" : "var(--surface)",
        border: `1.5px solid ${
          todo.done        ? "var(--sand-3)"
        : todo.inProgress  ? "var(--amber-border)"
        : "var(--sand-3)"}`,
        borderLeft: todo.inProgress && !todo.done
          ? "3px solid var(--amber)" : undefined,
        borderRadius: "var(--r-lg)",
        padding: "14px 14px 14px 16px",
        minHeight: 62,
        opacity: todo.done ? 0.62 : 1,
        transition: "border-color 0.15s, opacity 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={e => {
        if (!todo.done && !removing)
          e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Checkbox */}
      <div style={{ paddingTop: 2 }}>
        <label className={`check-wrap${checkAnim ? " check-pop" : ""}`} aria-label={todo.done ? `Unmark "${todo.text}" done` : `Mark "${todo.text}" done`}>
          <input type="checkbox" checked={todo.done} onChange={handleToggle} />
          <span className="check-visual">
            <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden="true">
              <path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </label>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 5 }}>
        {editing ? (
          <input
            ref={editRef}
            className="edit-input"
            value={editVal}
            onChange={e => setEditVal(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") saveEdit();
              if (e.key === "Escape") { setEditVal(todo.text); setEditing(false); }
            }}
            onBlur={saveEdit}
            maxLength={MAX + 10}
          />
        ) : (
          <span style={{
            fontSize: 15, fontWeight: 400, color: todo.done ? "var(--ink-2)" : "var(--ink)",
            textDecoration: todo.done ? "line-through" : "none",
            textDecorationColor: "var(--ink-3)",
            lineHeight: 1.45, wordBreak: "break-word",
            cursor: "text",
          }}
          onDoubleClick={() => !todo.done && setEditing(true)}
          >
            {todo.text}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {/* Priority badge */}
          <span style={{
            fontSize: 11, fontWeight: 500,
            color: pc.text, background: pc.bg,
            border: `1px solid ${pc.border}`,
            borderRadius: 99, padding: "1px 8px",
          }}>
            <span style={{
              display: "inline-block", width: 6, height: 6,
              borderRadius: "50%", background: pc.text,
              marginRight: 4, verticalAlign: "middle",
            }}/>
            {PRIORITY_LABELS[todo.priority] || "Medium"}
          </span>
          {/* In progress badge */}
          {todo.inProgress && !todo.done && (
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: "var(--amber)", background: "var(--amber-light)",
              border: "1px solid var(--amber-border)",
              borderRadius: 99, padding: "1px 8px",
            }}>
              In progress
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      {confirmOpen ? (
        <div
          className="slide-right"
          style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}
          role="group" aria-label="Confirm delete"
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--rose)", whiteSpace: "nowrap" }}>Remove?</span>
          <button
            ref={confirmRef}
            onClick={handleDelete}
            style={{
              fontFamily: "inherit", fontSize: 12, fontWeight: 500,
              background: "var(--rose)", color: "#fff",
              border: "1px solid var(--rose)", borderRadius: "var(--r-sm)",
              padding: "0 12px", height: 32, cursor: "pointer",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--rose-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--rose)"; }}
          >
            Yes
          </button>
          <button
            onClick={() => setConfirmOpen(false)}
            style={{
              fontFamily: "inherit", fontSize: 12, fontWeight: 500,
              background: "var(--surface)", color: "var(--ink-2)",
              border: "1.5px solid var(--sand-3)", borderRadius: "var(--r-sm)",
              padding: "0 12px", height: 32, cursor: "pointer",
              transition: "background 0.12s, border-color 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--sand)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}
          >
            No
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 5, flexShrink: 0, alignItems: "center" }}>
          {!todo.done && !editing && (
            <button
              data-tip="Edit"
              onClick={() => setEditing(true)}
              aria-label={`Edit "${todo.text}"`}
              style={{
                background: "transparent", border: "1.5px solid var(--sand-3)",
                borderRadius: "var(--r-sm)", width: 34, height: 34,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--ink-2)",
                transition: "border-color 0.12s, background 0.12s, color 0.12s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--violet-border)";
                e.currentTarget.style.background = "var(--violet-light)";
                e.currentTarget.style.color = "var(--violet)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--sand-3)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--ink-2)";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                <path d="M9.5 1.5L11.5 3.5L4 11H2V9L9.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          {!todo.done && (
            <button
              data-tip={todo.inProgress ? "Unmark doing" : "Mark doing"}
              onClick={() => onProgress(todo.id)}
              aria-pressed={todo.inProgress}
              aria-label={todo.inProgress ? `Unmark "${todo.text}" as in progress` : `Mark "${todo.text}" in progress`}
              style={{
                fontFamily: "inherit", fontSize: 12, fontWeight: 500,
                background: todo.inProgress ? "var(--amber-light)" : "transparent",
                color: todo.inProgress ? "var(--amber)" : "var(--ink-2)",
                border: `1.5px solid ${todo.inProgress ? "var(--amber-border)" : "var(--sand-3)"}`,
                borderRadius: "var(--r-sm)", padding: "0 10px", height: 34,
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s",
              }}
              onMouseEnter={e => {
                if (!todo.inProgress) {
                  e.currentTarget.style.background = "var(--amber-light)";
                  e.currentTarget.style.borderColor = "var(--amber-border)";
                  e.currentTarget.style.color = "var(--amber)";
                }
              }}
              onMouseLeave={e => {
                if (!todo.inProgress) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "var(--sand-3)";
                  e.currentTarget.style.color = "var(--ink-2)";
                }
              }}
            >
              {todo.inProgress ? "Doing ✓" : "Mark doing"}
            </button>
          )}
          <button
            data-tip="Delete"
            onClick={() => setConfirmOpen(true)}
            aria-label={`Delete "${todo.text}"`}
            style={{
              fontFamily: "inherit", fontSize: 12, fontWeight: 500,
              background: "transparent", color: "var(--rose)",
              border: "1.5px solid var(--rose-border)",
              borderRadius: "var(--r-sm)", padding: "0 10px", height: 34,
              cursor: "pointer", whiteSpace: "nowrap",
              transition: "background 0.12s, border-color 0.12s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "var(--rose-light)";
              e.currentTarget.style.borderColor = "#F08080";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--rose-border)";
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Empty state
══════════════════════════════════════════ */
const EMPTY = {
  All:    { icon: "📋", title: "No tasks yet", sub: "Add your first task above to get started." },
  Active: { icon: "🎉", title: "All caught up!", sub: "No active tasks — you're on top of it." },
  Doing:  { icon: "🚀", title: "Nothing in progress", sub: "Mark a task as \"doing\" to see it here." },
  Done:   { icon: "📌", title: "Nothing completed", sub: "Finish a task and it'll appear here." },
};

function EmptyState({ filter }) {
  const s = EMPTY[filter] || EMPTY.All;
  return (
    <div className="fade-in" style={{ textAlign: "center", padding: "44px 24px" }} role="status">
      <div style={{ fontSize: 32, marginBottom: 10, lineHeight: 1 }}>{s.icon}</div>
      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", marginBottom: 5 }}>{s.title}</p>
      <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55 }}>{s.sub}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Sort controls
══════════════════════════════════════════ */
function SortBar({ sort, setSort }) {
  const opts = [
    { value: "newest",   label: "Newest" },
    { value: "oldest",   label: "Oldest" },
    { value: "priority", label: "Priority" },
    { value: "alpha",    label: "A–Z" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: "var(--ink-3)", flexShrink: 0 }}>Sort:</span>
      {opts.map(o => (
        <button
          key={o.value}
          onClick={() => setSort(o.value)}
          style={{
            fontFamily: "inherit", fontSize: 12, fontWeight: 500,
            color: sort === o.value ? "var(--violet)" : "var(--ink-2)",
            background: sort === o.value ? "var(--violet-light)" : "transparent",
            border: `1px solid ${sort === o.value ? "var(--violet-border)" : "var(--sand-3)"}`,
            borderRadius: 99, padding: "3px 10px", cursor: "pointer",
            transition: "all 0.12s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   App root
══════════════════════════════════════════ */
function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Review quarterly goals",  done: false, inProgress: true,  priority: "high",   createdAt: Date.now() - 3e6 },
    { id: 2, text: "Write project proposal",  done: false, inProgress: false, priority: "high",   createdAt: Date.now() - 2e6 },
    { id: 3, text: "Set up design system",    done: true,  inProgress: false, priority: "medium", createdAt: Date.now() - 1e6 },
    { id: 4, text: "Book team retrospective", done: false, inProgress: false, priority: "low",    createdAt: Date.now() - 5e5 },
    { id: 5, text: "Update documentation",    done: false, inProgress: false, priority: "medium", createdAt: Date.now() - 2e5 },
  ]);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const toast = useToast();

  const existing = todos.map(t => t.text.toLowerCase());

  const counts = {
    all:    todos.length,
    active: todos.filter(t => !t.done && !t.inProgress).length,
    doing:  todos.filter(t => t.inProgress && !t.done).length,
    done:   todos.filter(t => t.done).length,
  };

  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

  const visible = todos
    .filter(t =>
      filter === "All"    ? true
    : filter === "Active" ? !t.done && !t.inProgress
    : filter === "Doing"  ? t.inProgress && !t.done
    : t.done
    )
    .sort((a, b) =>
      sort === "newest"   ? b.createdAt - a.createdAt
    : sort === "oldest"   ? a.createdAt - b.createdAt
    : sort === "priority" ? PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    : a.text.localeCompare(b.text)
    );

  const addTodo = (text, priority) => {
    const item = { id: uid(), text, done: false, inProgress: false, priority, createdAt: Date.now() };
    setTodos(p => [item, ...p]);
    toast(`"${text}" added`, "success");
  };

  const toggleDone = id => {
    setTodos(p => p.map(t =>
      t.id === id ? { ...t, done: !t.done, inProgress: t.done ? t.inProgress : false } : t
    ));
  };

  const toggleProgress = id => {
    setTodos(p => p.map(t => t.id === id ? { ...t, inProgress: !t.inProgress } : t));
  };

  const editTodo = (id, text) => {
    setTodos(p => p.map(t => t.id === id ? { ...t, text } : t));
  };

  const deleteTodo = id => {
    const todo = todos.find(t => t.id === id);
    setTodos(p => p.filter(t => t.id !== id));
    const undo = () => {
      setTodos(p => [todo, ...p]);
      toast("Task restored", "info");
    };
    toast(`"${todo?.text}" removed`, "danger", undo);
  };

  const clearDone = () => {
    const n = counts.done;
    if (!n) return;
    const saved = todos.filter(t => t.done);
    setTodos(p => p.filter(t => !t.done));
    const undo = () => {
      setTodos(p => [...p, ...saved]);
      toast("Restored completed tasks", "info");
    };
    toast(`${n} completed task${n !== 1 ? "s" : ""} cleared`, "info", undo);
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <a
        href="#main"
        style={{
          position: "fixed", top: 12, left: 12, zIndex: 9999,
          padding: "9px 16px", background: "var(--violet)", color: "#fff",
          fontSize: 13, fontWeight: 600, borderRadius: "var(--r-md)",
          textDecoration: "none", transform: "translateY(-80px)",
          transition: "transform 0.15s",
        }}
        onFocus={e => { e.currentTarget.style.transform = "translateY(0)"; }}
        onBlur={e => { e.currentTarget.style.transform = "translateY(-80px)"; }}
      >
        Skip to content
      </a>

      <div style={{ width: "100%", maxWidth: 600, margin: "0 auto", padding: "48px 16px 96px" }}>
        {/* ── Header ── */}
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 22 }}>
            <div>
              <h1 style={{
                fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 700,
                letterSpacing: -0.8, color: "var(--ink)", lineHeight: 1.12,
              }}>
                TaskFlow
              </h1>
              <p style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 3 }}>
                {counts.active === 0 && counts.all > 0
                  ? "All tasks complete 🎉"
                  : counts.all === 0
                  ? "Add your first task to get started"
                  : `${counts.active + counts.doing} of ${counts.all} remaining`}
              </p>
            </div>
            <Ring done={counts.done} total={counts.all} />
          </div>
          <Tabs active={filter} onChange={setFilter} counts={counts} />
        </header>

        {/* ── Main ── */}
        <main id="main">
          <AddInput onAdd={addTodo} existing={existing} />

          {visible.length > 1 && <SortBar sort={sort} setSort={setSort} />}

          <section aria-label={`${filter} tasks`}>
            {visible.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <div role="list" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {visible.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleDone}
                    onProgress={toggleProgress}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* ── Footer ── */}
        {counts.done > 0 && (
          <footer className="fade-in" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--sand-3)",
          }}>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>
              {counts.done} task{counts.done !== 1 ? "s" : ""} completed
            </span>
            <button
              onClick={clearDone}
              style={{
                fontFamily: "inherit", fontSize: 13, fontWeight: 500,
                color: "var(--ink-2)", background: "transparent",
                border: "1.5px solid var(--sand-3)", borderRadius: "var(--r-sm)",
                padding: "6px 14px", cursor: "pointer", minHeight: 36,
                transition: "all 0.13s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--rose)";
                e.currentTarget.style.borderColor = "var(--rose-border)";
                e.currentTarget.style.background = "var(--rose-light)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--ink-2)";
                e.currentTarget.style.borderColor = "var(--sand-3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   Root export (wrapped in toast provider)
══════════════════════════════════════════ */
export default function TaskFlow() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  );
}