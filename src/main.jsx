import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

export const IRIWidget = (config={}) => {
  const container = document.getElementById("iri-script-widget");
    return ReactDOM.createRoot(container || document.body).render(
      <React.StrictMode>
        <App config={config}/>
      </React.StrictMode>,
  );
};
