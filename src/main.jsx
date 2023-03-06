import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// export const IRIWidget = (config={}) => {
//   const container = document.getElementById("iri-script-widget");
//     return ReactDOM.createRoot(container || document.body).render(
//       <React.StrictMode>
//         <App config={config}/>
//       </React.StrictMode>,
//   );
// };

const config = {
  baseurl: "https://access.axiomprotect.com:6653/AxiomProtect",
  showPopup: true,
  onResponse: function onResponse(data) {
    console.log("Response item :::", data);
  },
  onError: function onError(data) {
    console.log("Error item :::", data);
  },
  onPopupClose: function onPopupClose(data) {
    console.log("Popup close item :::", data);
  }
};
const container = document.getElementById("iri-script-widget");
ReactDOM.createRoot(container || document.body).render(
  <React.StrictMode>
    <App config={config}/>
  </React.StrictMode>,
);