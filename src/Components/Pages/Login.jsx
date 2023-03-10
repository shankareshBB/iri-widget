import React from 'react'
// Material UI 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, Typography, Link, Stack, Avatar } from '@mui/material';
// images
import IRISuccess from '../../assets/Accountsuccess.gif';
// api calls
import axios from 'axios';

const steps = ['Step 1 - User Info', 'Step 2 - Send OTP/Push', 'Step 3 - Verify OTP'];

function ValidateEmailAddress(inputTxt) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputTxt)) {
        return (true)
    }
    return (false)
}

export default function LoginPage(props) {
  // consumer data
  const { 
    config, 
    largeScreen, 
    proceedBtnPopup, 
    setProceedBtnPopup, 
    tokenValue, 
    page, 
    setPage,
    appType, // app type defines absolute token or google authenticator token
    loginEmailId,
    setLoginEmailId,
    loginErrorMessage,
    setLoginErrorMessage,
    loginUserDetails,
    setLoginUserDetails,
    loginMethods,
    loginSelectedMethod,
    setLoginSelectedMethod,
    loginPushId,
    setLoginPushId,
    loginOTP,
    setLoginOTP,
    loginPushStatusDetails,
    setLoginPushStatusDetails
  } = props;

  const [loginLoading, setLoginLoading] = React.useState(false);
  const [loginPushLoading, setLoginPushLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);

  const onResponse = config?.onResponse
    ? config.onResponse
    : (data) => {
        console.log("Login page Response ::> ", data);
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

    // clear login page
    const clearLogin = () =>{
        setLoginEmailId('');
        setLoginErrorMessage('');
        setLoginUserDetails({});
        setLoginSelectedMethod('');
        setLoginOTP('');
        setLoginPushId('');
        setLoginPushStatusDetails({});
        setLoginLoading(false);
        setActiveStep(0);
    }

    const getUserByTypeOneOrAny = async(e) => {
        e.preventDefault();
        
        setLoginLoading(true);
        try {
            const validEmail = ValidateEmailAddress(loginEmailId);
            if(validEmail === false) {
              onError({ 'action':'Form validation', 'error':'Invalid email address' });
              setActiveStep(0);
              setLoginErrorMessage('Invalid email address');
              return;
            }

            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'get',
                url: `${config?.baseurl}/v1/user/getUserByType?requestTime=${reqTime}&searchFor=${loginEmailId}&type=${appType}`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/v1/user/getUserByType', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setLoginUserDetails(response?.data?.resultData);
                setActiveStep(1);
                setLoginErrorMessage('');
            } else {
                setActiveStep(0);
                setLoginErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(0);
            onError({ 'at':'/v1/user/getUserByType', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setLoginErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setLoginLoading(false);
        }
    };
    // check Push Notification
    const checkPushNotification = (id) => {
        setLoginPushLoading(true);
        let intervalId = setInterval(async() => {
            try {
                const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
                const response = await axios({
                    method: 'post',
                    url: `${config?.baseurl}/v1/authenticator/checkPushTransactionStatus?requestTime=${reqTime}&userId=${loginUserDetails?.userid}&pushId=${id}`,
                    headers: {
                        "authToken": tokenValue
                    }
                });
                onResponse({ 'at':'/v1/authenticator/checkPushTransactionStatus', 'response':response?.data});
                setLoginPushStatusDetails(response?.data);
                if(response?.data?.resultCode === 0) {
                    setActiveStep(3);
                    setLoginErrorMessage('');
                } else {
                    setActiveStep(1);
                    setLoginErrorMessage(response?.data?.resultMessage || 'Error');
                }
            } catch (error) {
                setActiveStep(1);
                onError({ 'at':'/v1/authenticator/checkPushTransactionStatusP', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
                setLoginErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
            }
        }, 1000); // call API every second
    
        setTimeout(() => {
            clearInterval(intervalId);
            setLoginPushLoading(false);
        }, 60000); // stop after 1 minute
    };

    // do send otp or push
    const doSendOTP = async() => {
        setLoginLoading(true);
        try {
            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'post',
                url: `${config?.baseurl}/v1/token/sendOTP?requestTime=${reqTime}&userId=${loginUserDetails?.userid}&category=3&type=1`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/v1/token/sendOTP', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setActiveStep(2);
                setLoginErrorMessage('');
            } else {
                setActiveStep(1);
                setLoginErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(1);
            onError({ 'at':'/v1/token/sendOTP', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setLoginErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setLoginLoading(false);
        }
    };
    const doSendPush = async() => {
        setLoginLoading(true);
        try {
            let jsonObject = {
                "requestType":1, 
                "expirytimeInMins":1,
            };
            // "amount": "string",
            // "appId": "string",
            // "appUrl": "string",
            // "consentRequester": "string",
            // "consetPurpose": "string",
            // "device": "string",
            // "expirytimeInMins": 0,
            // "fromAccount": "string",
            // "ip": "string",
            // "message": "string",
            // "options": "string",
            // "pushMessageType": 0,
            // "requestType": 0,
            // "title": "string",
            // "toAccount": "string",
            // "updatePushRequestBefore": "string",
            
            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'post',
                url: `${config?.baseurl}/v1/authenticator/sendPush?requestTime=${reqTime}&accountId=${loginUserDetails?.accountid}&userId=${loginUserDetails?.userid}`,
                data: jsonObject,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/v1/authenticator/sendPush', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setLoginPushId(response?.data?.resultData);
                // setActiveStep(2);
                // setLoginErrorMessage('');
                checkPushNotification(response?.data?.resultData);
                
            } else {
                setActiveStep(1);
                setLoginErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(1);
            onError({ 'at':'/v1/authenticator/sendPush', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setLoginErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setLoginLoading(false);
        }
    };
    const doSendOTPOrPush = async(e) => {
        e.preventDefault();
        
        if(loginSelectedMethod == 1) {
            doSendOTP();
        } else if(loginSelectedMethod == 2) {
            setActiveStep(2);
            setLoginErrorMessage('');
        } else if(loginSelectedMethod == 3) {
            doSendPush();
        } else {
            setLoginErrorMessage('Select a method to send');
        }
    };

    // verify OTP
    const verifyOTP = async(e) => {
        e.preventDefault();
        
        setLoginLoading(true);
        try {
            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'post',
                url: `${config?.baseurl}/v1/token/verifyOTP?requestTime=${reqTime}&userId=${loginUserDetails?.userid}&OTP=${loginOTP}&category=${loginSelectedMethod==1?3:1}`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/v1/token/verifyOTP', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setActiveStep(3);
                setLoginErrorMessage('');
            } else {
                setActiveStep(2);
                setLoginErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(2);
            onError({ 'at':'/v1/token/verifyOTP', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setLoginErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setLoginLoading(false);
        }
    };

  return (
    <React.Fragment>
        {/* --------- Login PAGE 2--------- */}
        <h1 style={{ paddingLeft: largeScreen?'10px':'0px' }}>Login</h1>

        <Box sx={{ width: '100%' }}>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={IRISuccess}
                            alt={"SUCCESS"}
                            loading="lazy"
                            width={200}
                        />
                    </div>
                    <Typography sx={{ mt: 3, mb: 3, textAlign:'center', minWidth: largeScreen?'400px':'auto' }}>
                        Successfully Logged In!
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent:'center', py: 1 }}>
                        <Button
                            variant='contained'
                            onClick={() => {
                                setPage(0);
                                clearLogin();
                            }}
                            sx={{
                                // borderRadius: '30px',
                                fontWeight:'bold',
                                backgroundColor:'#282829',
                                color:'#fff',
                                '&:active, &:focus, &:hover': {
                                    backgroundColor:'#000',
                                }
                            }}
                        >
                            Home
                        </Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                
                    {activeStep === 0 &&
                        <form onSubmit={getUserByTypeOneOrAny} autoComplete="off" >
                            <Stack 
                                direction='column'
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                style={{ padding: largeScreen?'10px':'0px', minWidth: largeScreen?'500px':'auto' }}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    disabled={!(activeStep===0)}
                                    id="outlined-required"
                                    type='email'
                                    label="Email ID"
                                    placeholder='Enter your email address'
                                    value={loginEmailId}
                                    onChange={(event) => {
                                        setLoginEmailId(event.target.value);
                                    }
                                    }
                                />
                            </Stack>
                            <div style={{ textAlign:'center', padding:'10px' }}>
                                {loginErrorMessage && 
                                    <div 
                                        style={{ 
                                        color: '#ff0000',
                                        padding: '0px 12px 5px 12px',
                                        fontSize: '12px',
                                        textAlign: 'center'
                                        }}
                                    >
                                        {loginErrorMessage}
                                    </div>
                                }
                            </div>
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                style={{ paddingTop:'10px' }}
                            >
                                <Button 
                                    variant='contained'
                                    // fullWidth
                                    onClick={() => {
                                        setPage(0);
                                        clearLogin();
                                    }}
                                    disabled={loginLoading}
                                    sx={{
                                        // borderRadius: '30px',
                                        fontWeight:'bold',
                                        backgroundColor:'#282829',
                                        color:'#fff',
                                        '&:active, &:focus, &:hover': {
                                            backgroundColor:'#000',
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <LoadingButton 
                                    variant='contained'
                                    loading={loginLoading}
                                    disabled={loginEmailId ? false : true}
                                    type='submit'
                                    sx={{
                                        // borderRadius: '30px',
                                        fontWeight:'bold',
                                        backgroundColor:'#ffc107',
                                        color:'#fff',
                                        '&:active, &:focus, &:hover': {
                                            backgroundColor:'#ffbf00',
                                        }
                                    }}
                                >
                                    Next
                                </LoadingButton>
                            </Stack>
                        </form>
                    }

                    {activeStep === 1 &&
                        <form onSubmit={doSendOTPOrPush} autoComplete="off" >
                            <Stack 
                                direction='column'
                                justifyContent="flex-start"
                                alignItems="center"
                                spacing={2}
                                style={{ padding: largeScreen?'10px':'0px', minWidth: largeScreen?'500px':'auto', maxWidth: largeScreen?'700px':'auto' }}
                            >
                                {loginMethods?.length>0 ?
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">Select Method</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={loginSelectedMethod}
                                            onChange={(event) => {
                                                setLoginSelectedMethod(event.target.value);
                                            }}
                                        >
                                            {loginMethods?.map((item,index) => 
                                                <FormControlLabel 
                                                    key={index} 
                                                    value={item?.id} 
                                                    control={<Radio />} 
                                                    label={<React.Fragment>
                                                        <Avatar
                                                            alt={item?.name}
                                                            src={item?.image}
                                                            variant="square"
                                                            sx={{ width: 60, height: 60 }}
                                                        />
                                                        <Typography>{item?.name}</Typography>
                                                    </React.Fragment>} 
                                                />
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                :
                                    <Typography>No Method Found</Typography>
                                }
                            </Stack>
                            <div style={{ textAlign:'center', padding:'10px' }}>
                               
                                {loginErrorMessage && 
                                    <div 
                                        style={{ 
                                        color: '#ff0000',
                                        padding: '0px 12px 5px 12px',
                                        fontSize: '12px',
                                        textAlign: 'center'
                                        }}
                                    >
                                        {loginErrorMessage}
                                    </div>
                                }
                            </div>
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                style={{ paddingTop:'10px' }}
                            >
                                <Button 
                                    variant='contained'
                                    // fullWidth
                                    onClick={() => {
                                        setActiveStep(0);
                                    }}
                                    disabled={loginLoading && loginPushLoading}
                                    sx={{
                                        // borderRadius: '30px',
                                        fontWeight:'bold',
                                        backgroundColor:'#282829',
                                        color:'#fff',
                                        '&:active, &:focus, &:hover': {
                                            backgroundColor:'#000',
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <LoadingButton 
                                    variant='contained'
                                    loading={loginLoading && loginPushLoading}
                                    disabled={loginSelectedMethod ? false : true}
                                    type='submit'
                                    sx={{
                                        // borderRadius: '30px',
                                        fontWeight:'bold',
                                        backgroundColor:'#ffc107',
                                        color:'#fff',
                                        '&:active, &:focus, &:hover': {
                                            backgroundColor:'#ffbf00',
                                        }
                                    }}
                                >
                                    Next
                                </LoadingButton>
                            </Stack>
                        </form>
                    }

                    {activeStep === 2 &&
                        <form onSubmit={verifyOTP} autoComplete="off" >
                            <Stack 
                                direction='column'
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                style={{ padding: largeScreen?'10px':'0px', minWidth: largeScreen?'500px':'auto' }}
                            >
                                <TextField
                                    required
                                    fullWidth
                                    disabled={!(activeStep === 2)}
                                    // variant='outlined'
                                    id="outlined-required"
                                    label="OTP"
                                    placeholder='Enter your OTP'
                                    value={loginOTP}
                                    onChange={(event) => {
                                        setLoginOTP(event.target.value);
                                    }
                                    }
                                />

                            </Stack>
                            <div style={{ textAlign:'center', padding:'10px' }}>
                               
                                {loginErrorMessage && 
                                    <div 
                                        style={{ 
                                        color: '#ff0000',
                                        padding: '0px 12px 5px 12px',
                                        fontSize: '12px',
                                        textAlign: 'center'
                                        }}
                                    >
                                        {loginErrorMessage}
                                    </div>
                                }
                            </div>
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }}
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                style={{ paddingTop:'10px' }}
                            >
                                <Button 
                                    variant='contained'
                                    // fullWidth
                                    onClick={() => {
                                        setActiveStep(1);
                                        setLoginOTP('');
                                    }}
                                    disabled={loginLoading}
                                    sx={{
                                        // borderRadius: '30px',
                                        fontWeight:'bold',
                                        backgroundColor:'#282829',
                                        color:'#fff',
                                        '&:active, &:focus, &:hover': {
                                            backgroundColor:'#000',
                                        }
                                    }}
                                >
                                    Back
                                </Button>
                                <LoadingButton 
                                    variant='contained'
                                    loading={loginLoading}
                                    disabled={loginOTP ? false : true}
                                    type='submit'
                                    sx={{
                                        // borderRadius: '30px',
                                        fontWeight:'bold',
                                        backgroundColor:'#ffc107',
                                        color:'#fff',
                                        '&:active, &:focus, &:hover': {
                                            backgroundColor:'#ffbf00',
                                        }
                                    }}
                                >
                                    Submit
                                </LoadingButton>
                            </Stack>
                        </form>
                    }

                </React.Fragment>
            )}
        </Box>

        <div style={{ textAlign:'center', padding:'10px' }}>
            {!(activeStep === steps.length) && <Link href={config?.linkForTC} underline="hover" target="_blank">Terms and Conditions</Link>}
        </div>
    </React.Fragment>
  );
}