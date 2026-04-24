import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import "bootstrap/dist/css/bootstrap.min.css";

// Suppress ResizeObserver browser noise — not a real error - when runnign inbrowser
window.addEventListener('error', (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
  }
});
const resizeObserverErr = window.onerror;
window.onerror = (msg, ...args) => {
  if (msg.includes('ResizeObserver')) return true;
  return resizeObserverErr?.(...args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);


reportWebVitals();