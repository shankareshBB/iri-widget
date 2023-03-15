import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import PopUpIndex from './Components';
import axios from 'axios';

function App({ config }) {
  // all data are available check
  const [isAllowed, setIsAllowed] = React.useState(false);
  // for calling only once (react18 useEffect calls twice)
  const callingOnceConfig = React.useRef(true);

  const onError = config?.onError
    ? config.onError
    : (err) => {
        throw err;
      };
    
  // btn is clicked or not
  const [proceedBtnPopup, setProceedBtnPopup] = React.useState(false);

  React.useEffect(() => {
    if(config?.showPopup) {
      setProceedBtnPopup(true);
    } else {
      setProceedBtnPopup(false);
    }

    return () => { }
  },[config?.showPopup]);

  function configErr(message) {
    onError(new Error(message));
    onError({
      "result": "Configuration data are missing out. Please provide it!",
      "message": {message},
      "action": "config data"
    });
  }
  
  React.useEffect(() => {
    if(callingOnceConfig.current) {
      callingOnceConfig.current=false;
      setIsAllowed(false);
      if (!config) {
        configErr("Please pass all required configuration object in Props");
      } else if (!config?.baseurl) {
        configErr("Please pass base URL in config");
      } else if (!config?.linkForTC) {
        configErr("Please pass Link for Terms and condition in config");
      } else {
        setIsAllowed(true);
      }
    }

    return () => { console.log("IRI Self Registration Version : 1.0.3"); }
  }, []);

  return (
    <div className="IRI-App">
      {/* ------- POP UP MODULE ------- */}
      {proceedBtnPopup && 
        <PopUpIndex 
          config={config}
          isAllowed={isAllowed}
          proceedBtnPopup={proceedBtnPopup}
          setProceedBtnPopup={setProceedBtnPopup}
        />
      }
    </div>
  )
}

export default App
