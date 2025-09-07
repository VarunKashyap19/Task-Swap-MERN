import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log("✅ Index.js loaded"); // 👈 add this

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
