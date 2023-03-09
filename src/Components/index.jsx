import React from 'react'
import FirstPageIndex from './Pages';
import { Button, Dialog, useMediaQuery } from '@mui/material';

export default function PopUpIndex(props) {
    const { config, proceedBtnPopup, setProceedBtnPopup, tokenValue, setTokenValue, isAllowed, widgetStatusDisplay, setWidgetStatusDisplay } = props;
    // make popup fullScreen or not
    const largeScreen = useMediaQuery('(min-width:480px)');

    const onPopupClose = config?.onPopupClose
        ? config.onPopupClose
        : (data) => {
            console.log("Pop Up closed ::> ",data);
        };

    return (<center>
        {widgetStatusDisplay ?
            <Dialog
                fullScreen={largeScreen?false:true}
                aria-labelledby="customized-status-popup"
                open={proceedBtnPopup}
            >
                <center>
                    <div style={{ padding:'2rem',minWidth:'300px' }}>
                        <div style={{ color:'red',fontWeight:'600',padding:'2rem' }}>
                            {['pending', 'success', 'expired'].includes(widgetStatusDisplay?.toLowerCase())? 
                                <> {'Your token is '} {widgetStatusDisplay?.toLowerCase()}!</>
                            :
                                <>{widgetStatusDisplay}</>
                            }
                        </div>
                        <Button 
                            variant='contained'
                            onClick={() => {
                                setProceedBtnPopup(false);
                                onPopupClose({
                                    "result": widgetStatusDisplay,
                                    "action": "status"
                                });
                            }}
                            sx={{
                                // borderRadius: '30px',
                                fontWeight:'bold',
                                backgroundColor:'#282829',
                                color:'#fff',
                                mt:2, 
                                '&:active, &:focus, &:hover': {
                                    backgroundColor:'#000',
                                }
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </center>
            </Dialog>
            :
            <>{isAllowed ?
                <FirstPageIndex 
                    config={config}
                    proceedBtnPopup={proceedBtnPopup}
                    setProceedBtnPopup={setProceedBtnPopup}
                    largeScreen={largeScreen}
                    tokenValue={tokenValue}
                    setTokenValue={setTokenValue}
                    widgetStatusDisplay={widgetStatusDisplay}
                    setWidgetStatusDisplay={setWidgetStatusDisplay}
                />
            :
                <Dialog
                    fullScreen={largeScreen?false:true}
                    aria-labelledby="customized-config-popup"
                    open={proceedBtnPopup}
                >
                    <center>
                        <div style={{ padding:'2rem',minWidth:'300px' }}>
                            <div style={{ color:'red',fontWeight:'600',padding:'2rem' }}>
                                Configuration data are missing out. Please provide it!
                            </div>
                            <Button 
                                variant='outlined'
                                size='small'
                                onClick={() => {
                                    setProceedBtnPopup(false);
                                    onPopupClose({
                                        "result": "Configuration data are missing out. Please provide it!",
                                        "action": "config data"
                                    });
                                }}
                                sx={{
                                    // borderRadius: '30px',
                                    fontWeight:'bold',
                                    backgroundColor:'#282829',
                                    color:'#fff',
                                    mt:2, 
                                    '&:active, &:focus, &:hover': {
                                        backgroundColor:'#000',
                                    }
                                }}
                            >
                                Close
                            </Button>
                        </div>
                    </center>
                </Dialog>
            }</>
        }
    </center>);
}