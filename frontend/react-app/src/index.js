import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  // The React.StrictMode is a component tool for highlighting potential problems in an application and providing more information regarding the errors encountered.
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);

