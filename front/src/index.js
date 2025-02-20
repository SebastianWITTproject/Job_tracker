import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18+
import App from './components/App';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root')); // This is the correct approach
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
