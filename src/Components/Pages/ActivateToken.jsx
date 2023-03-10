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

const steps = ['Step 1 - User Info', 'Step 2 - Generate Token', 'Step 3 - Verify OTP'];

function ValidateEmailAddress(inputTxt) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputTxt)) {
        return (true)
    }
    return (false)
}
  
export default function ActivateTokenPage(props) {
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
    appTitle,
    setActTokenAppType,
    actTokenEmailId,
    setActTokenEmailId,
    actTokenErrorMessage,
    setActTokenErrorMessage,
    actTokenUserDetails,
    setActTokenUserDetails,
    actTokenAppDetails,
    setActTokenAppDetails,
    actTokenAppId,
    setActTokenAppId,
    actTokenOTPDetails,
    setActTokenOTPDetails,
    actTokenOTP,
    setActTokenOTP,
  } = props;

  const [actTokenLoading, setActTokenLoading] = React.useState(false);
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

    // clear Activation token page
    const clearActivateAbsoluteToken = () =>{
        setActTokenAppType({});
        setActTokenEmailId('');
        setActTokenErrorMessage('');
        setActTokenUserDetails({});
        setActTokenAppDetails([]);
        setActTokenAppId('');
        setActTokenOTP('');
        setActTokenOTPDetails('');
        setActTokenLoading(false);
        setActiveStep(0);
    }

    // get user by type 1/any and assign
    const getAssignedApplications = async(accountId,userId) => {
        try {
            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'get',
                url: `${config?.baseurl}/user/getAssignedApplicationsByType?requestTime=${reqTime}&accountId=${accountId}&userId=${userId}&appType=${appType}`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/user/getAssignedApplicationsByType', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setActTokenAppDetails(response?.data?.resultData?.filter(function (e) {
                    return e?.apptype == appType;
                }));
                setActiveStep(1);
                setActTokenErrorMessage('');
            } else {
                setActiveStep(0);
                setActTokenErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(0);
            onError({ 'at':'/user/getAssignedApplicationsByType', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setActTokenErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        }
    };
    const getUserByTypeOneOrAnyAndAssign = async(e) => {
        e.preventDefault();
        
        setActTokenLoading(true);
        try {
            const validEmail = ValidateEmailAddress(actTokenEmailId);
            if(validEmail === false) {
              onError({ 'action':'Form validation', 'error':'Invalid email address' });
              setActiveStep(0);
              setActTokenErrorMessage('Invalid email address');
              return;
            }

            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'get',
                url: `${config?.baseurl}/user/getUserByType?requestTime=${reqTime}&searchFor=${actTokenEmailId}&type=${appType}`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/user/getUserByType', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setActTokenUserDetails(response?.data?.resultData);
                getAssignedApplications(response?.data?.resultData?.accountid, response?.data?.resultData?.userid);
            } else {
                setActiveStep(0);
                setActTokenErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(0);
            onError({ 'at':'/user/getUserByType', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setActTokenErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setActTokenLoading(false);
        }
    };
  
    // do generate token
    const doGenerateToken = async(e) => {
        e.preventDefault();
        
        setActTokenLoading(true);
        try {
            const response = await axios({
                method: 'post',
                url: `${config?.baseurl}/absolute/generateToken?accountId=${actTokenUserDetails?.accountid}&id=${actTokenUserDetails?.userid}&appId=${actTokenAppId}&tokenType=2`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/absolute/generateToken', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setActTokenOTPDetails(response?.data?.resultData);
                setActiveStep(2);
                setActTokenErrorMessage('');
            } else {
                setActiveStep(1);
                setActTokenErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(1);
            onError({ 'at':'/absolute/generateToken', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setActTokenErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setActTokenLoading(false);
        }
    };

    // verify OTP
    const verifyOTP = async(e) => {
        e.preventDefault();
        
        setActTokenLoading(true);
        try {
            const response = await axios({
                method: 'post',
                url: `${config?.baseurl}/absolute/verifyOneTimePassword?userId=${actTokenUserDetails?.userid}&otp=${actTokenOTP}&appId=${actTokenAppId}`,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/absolute/verifyOneTimePassword', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setActiveStep(3);
                setActTokenErrorMessage('');
            } else {
                setActiveStep(2);
                setActTokenErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setActiveStep(2);
            onError({ 'at':'/absolute/verifyOneTimePassword', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setActTokenErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setActTokenLoading(false);
        }
    };

  return (
    <React.Fragment>
        {/* --------- Activate Absolute Token PAGE 1 --------- */}
        <h1 style={{ paddingLeft: largeScreen?'10px':'0px' }}>{appTitle}</h1>

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
                        Successfully Activated Absolute Token!
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent:'center', py: 1 }}>
                        <Button
                            variant='contained'
                            onClick={() => {
                                setPage(0);
                                clearActivateAbsoluteToken();
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
                        <form onSubmit={getUserByTypeOneOrAnyAndAssign} autoComplete="off" >
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
                                    value={actTokenEmailId}
                                    onChange={(event) => {
                                        setActTokenEmailId(event.target.value);
                                    }
                                    }
                                />
                            </Stack>
                            <div style={{ textAlign:'center', padding:'10px' }}>
                                {actTokenErrorMessage && 
                                    <div 
                                        style={{ 
                                        color: '#ff0000',
                                        padding: '0px 12px 5px 12px',
                                        fontSize: '12px',
                                        textAlign: 'center'
                                        }}
                                    >
                                        {actTokenErrorMessage}
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
                                        clearActivateAbsoluteToken();
                                    }}
                                    disabled={actTokenLoading}
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
                                    loading={actTokenLoading}
                                    disabled={actTokenEmailId ? false : true}
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
                        <form onSubmit={doGenerateToken} autoComplete="off" >
                            <Stack 
                                direction='column'
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                                style={{ padding: largeScreen?'10px':'0px', minWidth: largeScreen?'500px':'auto', maxWidth: largeScreen?'700px':'auto' }}
                            >
                                {actTokenAppDetails?.length>0 ?
                                    <FormControl>
                                        <FormLabel id="demo-controlled-radio-buttons-group">Select Application</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={actTokenAppId}
                                            onChange={(event) => {
                                                setActTokenAppId(event.target.value);
                                            }}
                                        >
                                            {actTokenAppDetails?.map((item,index) => 
                                                <FormControlLabel 
                                                    key={index} 
                                                    value={item?.appid} 
                                                    control={<Radio />} 
                                                    label={<>
                                                        <Avatar
                                                            alt={item?.appname}
                                                            src={item?.applogo}
                                                            variant="square"
                                                            sx={{ width: 80, height: 80 }}
                                                        />
                                                    </>} 
                                                />
                                            )}
                                        </RadioGroup>
                                    </FormControl>
                                :
                                    <Typography>No Applications Found</Typography>
                                }
                            </Stack>
                            <div style={{ textAlign:'center', padding:'10px' }}>
                               
                                {actTokenErrorMessage && 
                                    <div 
                                        style={{ 
                                        color: '#ff0000',
                                        padding: '0px 12px 5px 12px',
                                        fontSize: '12px',
                                        textAlign: 'center'
                                        }}
                                    >
                                        {actTokenErrorMessage}
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
                                    disabled={actTokenLoading}
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
                                    loading={actTokenLoading}
                                    disabled={actTokenAppId ? false : true}
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
                                    Generate Token
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
                                <img
                                    src={actTokenOTPDetails}
                                    alt={"QR Code"}
                                    loading="lazy"
                                />
                                
                                <TextField
                                    required
                                    fullWidth
                                    disabled={!(activeStep === 2)}
                                    // variant='outlined'
                                    id="outlined-required"
                                    label="OTP"
                                    placeholder='Enter your OTP'
                                    value={actTokenOTP}
                                    onChange={(event) => {
                                        setActTokenOTP(event.target.value);
                                    }
                                    }
                                />

                            </Stack>
                            <div style={{ textAlign:'center', padding:'10px' }}>
                               
                                {actTokenErrorMessage && 
                                    <div 
                                        style={{ 
                                        color: '#ff0000',
                                        padding: '0px 12px 5px 12px',
                                        fontSize: '12px',
                                        textAlign: 'center'
                                        }}
                                    >
                                        {actTokenErrorMessage}
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
                                    }}
                                    disabled={actTokenLoading}
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
                                    loading={actTokenLoading}
                                    disabled={actTokenOTP ? false : true}
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