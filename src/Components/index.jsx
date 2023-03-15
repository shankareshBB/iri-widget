import React from 'react'
import FirstPageIndex from './Pages';
import { Button, Dialog, useMediaQuery } from '@mui/material';

export default function PopUpIndex(props) {
    const { config, proceedBtnPopup, setProceedBtnPopup, isAllowed } = props;
    // make popup fullScreen or not
    const largeScreen = useMediaQuery('(min-width:480px)');

    const onPopupClose = config?.onPopupClose
        ? config.onPopupClose
        : (data) => {
            console.log("Pop Up closed ::> ",data);
        };

    return (<React.Fragment>
        {isAllowed ?
            <FirstPageIndex 
                config={config}
                proceedBtnPopup={proceedBtnPopup}
                setProceedBtnPopup={setProceedBtnPopup}
                largeScreen={largeScreen}
            />
        :
            <Dialog
                fullScreen={largeScreen?false:true}
                aria-labelledby="customized-config-popup"
                open={proceedBtnPopup}
            >
                <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'2rem' }}>
                    <div style={{ minWidth:'300px' }}>
                        <div style={{ color:'red',fontWeight:'600',padding:'2rem' }}>
                            Configuration data are missing out. Please provide it!
                        </div>
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
            </Dialog>
        }
    </React.Fragment>);
}