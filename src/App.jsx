import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import PopUpIndex from './Components';
import axios from 'axios';

function App({ config }) {
  // all data are available check
  const [isAllowed, setIsAllowed] = React.useState(false);
  // for calling only once (react18 useEffect calls twice)
  const callingOnceConfig = React.useRef(true);

  const onResponse = config?.onResponse
    ? config.onResponse
    : (data) => {
        console.log("JWT Token Response ::> ", data);
      };
  const onError = config?.onError
    ? config.onError
    : (err) => {
        throw err;
      };
  const onPopupClose = config?.onPopupClose
    ? config.onPopupClose
    : (data) => {
        console.log("Pop Up closed ::> ",data);
      };
    
  // Calling API 
  const [callingApi, setCallingApi] = React.useState(false);
  // btn is clicked or not
  const [proceedBtnPopup, setProceedBtnPopup] = React.useState(false);
  // show Widget Status Display
  const [widgetStatusDisplay, setWidgetStatusDisplay] = React.useState('');

  // get token value used for self reg and verifying user
  const [tokenValue, setTokenValue] = React.useState('');

  // get the JWT Token
  const getJWTToken = async () => {
    setCallingApi(true);
    try {
      const resp = await axios({
        method: 'POST',
        url: `${config?.baseurl}/absolute/getJWTToken?userId=${config?.userId}`
      });
      onResponse({"at":"/absolute/getJWTToken", "response":resp.data});
      if(resp?.data?.resultCode === 0) {
        setWidgetStatusDisplay('');
        setTokenValue(resp?.data?.resultData || '');
      } else {
        setWidgetStatusDisplay(resp?.data?.resultMessage);
        onError({
          "result": resp?.data?.resultMessage,
          "message": "Popup will get closed",
          "action": "user token"
        });
        // setProceedBtnPopup(false);
        // onPopupClose({
        //   "result": resp?.data?.resultMessage,
        //   "action": "transaction"
        // });
      }

      setCallingApi(false);
    } catch (error) {
      onError({"at":"/absolute/getJWTToken", "error": error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
      setWidgetStatusDisplay(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
      setCallingApi(false);
    }
  };

  React.useEffect(() => {
    if(config?.showPopup) {
      setProceedBtnPopup(true);
    } else {
      setProceedBtnPopup(false);
    }

    return () => { }
  },[config?.showPopup]);

  function configErr(message) {
    onError({
      "result": "Configuration data are missing out. Please provide it!",
      "message": {message},
      "action": "config data"
    });
    // setWidgetStatusDisplay(message);
    // setProceedBtnPopup(false);
    // onPopupClose({
    //   "result": "Configuration data are missing out. Please provide it!",
    //   "action": "config data"
    // });
  }

  
  React.useEffect(() => {
    if(callingOnceConfig.current) {
      callingOnceConfig.current=false;
      setIsAllowed(false);
      if (!config) {
        onError(new Error("Please pass all required config in Props"));
        configErr("Please pass all required config in Props");
      } else if (!config?.baseurl) {
        onError(new Error("Please pass base URL in config"));
        configErr("Please pass base URL in config");
      } else if (!config?.userId) {
        onError(new Error("Please pass User ID in config"));
        configErr("Please pass User ID in config");
      } else if (!config?.linkForTC) {
        onError(new Error("Please pass Link for Terms and condition in config"));
        configErr("Please pass Link for Terms and condition in config");
      } else {
        setIsAllowed(true);
        getJWTToken();
      }
    }

    return () => { }
  }, []);

  return (
    <div className="IRI-App">
      {/* ------- POP UP MODULE ------- */}
      {proceedBtnPopup && <>
        {callingApi ?
          <Backdrop
            sx={{ color: '#ffc107', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress  color="inherit" />
            &nbsp; &nbsp;<p style={{ color:'#f5f5f5' }}>Please wait...</p>
          </Backdrop>
        :
          <PopUpIndex 
            config={config}
            widgetStatusDisplay={widgetStatusDisplay}
            setWidgetStatusDisplay={setWidgetStatusDisplay}
            tokenValue={tokenValue}
            setTokenValue={setTokenValue}
            isAllowed={isAllowed}
            proceedBtnPopup={proceedBtnPopup}
            setProceedBtnPopup={setProceedBtnPopup}
          />
        }
      </>}
    </div>
  )
}

export default App
