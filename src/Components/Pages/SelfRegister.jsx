import React from 'react'
// Material UI 
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Checkbox, FormControlLabel, Link, Stack, Box } from '@mui/material';
// images
import IRISuccess from '../../assets/Accountsuccess.gif';
// api calls
import axios from 'axios';

function ValidateEmailAddress(inputTxt) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(inputTxt)) {
        return (true)
    }
    return (false)
}
function ValidatePhoneNumber(inputTxt) {
    var phoneNo = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if ((inputTxt.match(phoneNo))) {
        var plus = /\+[0-9]+/;
        if (inputTxt.match(plus)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
  
export default function SelfRegPage(props) {
  // consumer data
  const { 
    config, 
    largeScreen, 
    proceedBtnPopup, 
    setProceedBtnPopup, 
    tokenValue, 
    page, 
    setPage,

    sRegAccountId,
    setSRegAccountId,
    sRegUserId,
    setSRegUserId,
    sRegUsername,
    setSRegUsername,
    sRegEmailId,
    setSRegEmailId,
    sRegPhoneNumber,
    setSRegPhoneNumber,
    sRegAgree,
    setSRegAgree,
    sRegErrorMessage,
    setSRegErrorMessage,
    sRegShowSuccessMessage,
    setSRegShowSuccessMessage
  } = props;

  const [sRegLoading, setSRegLoading] = React.useState(false);

  const onResponse = config?.onResponse
    ? config.onResponse
    : (data) => {
        console.log("Create Account Response ::> ", data);
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

    // clear self register page
    const clearSelfRegister = () =>{
        setSRegAccountId('');
        setSRegUserId('');
        setSRegUsername('');
        setSRegEmailId('');
        setSRegPhoneNumber('');
        setSRegAgree(false);
        setSRegErrorMessage('');
        setSRegShowSuccessMessage('');
        setSRegLoading(false);
    }

    // create new account
    const createMyAccount = async(e) => {
        e.preventDefault();
        
        setSRegLoading(true);
        try {
            const validEmail = ValidateEmailAddress(sRegEmailId);
            if(validEmail === false) {
                onError({ 'action':'Form validation', 'error':'Invalid email address' });
                setSRegShowSuccessMessage(false);
                setSRegErrorMessage('Invalid email address');
                return;
            }
            const validPhone = ValidatePhoneNumber(sRegPhoneNumber);
            if(validPhone === false) {
                onError({ 'action':'Form validation', 'error':'Invalid phone number' });
                setSRegShowSuccessMessage(false);
                setSRegErrorMessage('Invalid phone number');
                return;
            }

            let jsonObject = {
                "accountid": sRegAccountId,
                "email": sRegEmailId,
                "phone": sRegPhoneNumber,
                "username": sRegUsername,
                "userid": sRegUserId,
                "defaulttoken": 1
            };
            const reqTime = new Date().toISOString().replaceAll("T", " ").replaceAll("Z", "");
            const response = await axios({
                method: 'post',
                url: `${config?.baseurl}/user/create?requestTime=${reqTime}`,
                data: jsonObject,
                headers: {
                    "authToken": tokenValue
                }
            });
            onResponse({ 'at':'/user/create', 'response':response?.data});

            if(response?.data?.resultCode === 0) {
                setSRegShowSuccessMessage(true);
                setSRegErrorMessage('');
            } else {
                setSRegShowSuccessMessage(false);
                setSRegErrorMessage(response?.data?.resultMessage || 'Error');
            }
        } catch (error) {
            setSRegShowSuccessMessage(false);
            onError({ 'at':'/user/create', 'error':error?.response?.data?.resultMessage || error?.response?.data || error?.message || error});
            setSRegErrorMessage(error?.response?.data?.resultMessage || error?.response?.data || error?.message || error);
        } finally {
            setSRegLoading(false);
        }
    };
  
  return (
    <React.Fragment>
        {/* --------- REGISTRATION PAGE 3 --------- */}
        <h1 style={{ paddingLeft: largeScreen?'10px':'0px' }}>Create User Account</h1>
        {sRegShowSuccessMessage ?
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
                    Successfully Created New Account!
                </Typography>
                <Box sx={{ display: 'flex', justifyContent:'center', py: 1 }}>
                    <Button
                        variant='contained'
                        onClick={() => {
                            setPage(0);
                            clearSelfRegister();
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
        :
            <React.Fragment>
                <form onSubmit={createMyAccount} autoComplete="off" >
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
                            id="outlined-required"
                            label="Account ID"
                            placeholder='Enter your account id'
                            value={sRegAccountId}
                            onChange={(event) => {
                                setSRegAccountId(event.target.value);
                            }
                            }
                        />
                    
                        <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            label="User ID"
                            placeholder='Enter your user id'
                            value={sRegUserId}
                            onChange={(event) => {
                                setSRegUserId(event.target.value);
                            }
                            }
                        />
                        
                        <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            label="User Name"
                            placeholder='Enter your user name'
                            value={sRegUsername}
                            onChange={(event) => {
                                setSRegUsername(event.target.value);
                            }
                            }
                        />

                        <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            type='email'
                            label="Email ID"
                            placeholder='Enter your email address'
                            value={sRegEmailId}
                            onChange={(event) => {
                                setSRegEmailId(event.target.value);
                            }
                            }
                        />

                        <TextField
                            required
                            fullWidth
                            id="outlined-required"
                            label="Phone Number"
                            placeholder='Enter your phone number'
                            value={sRegPhoneNumber}
                            onChange={(event) => {
                                setSRegPhoneNumber(event.target.value);
                            }
                            }
                            helperText="With country code"
                        />

                        <FormControlLabel 
                            control={
                                <Checkbox 
                                    checked={sRegAgree} 
                                    onChange={(event) => {
                                        setSRegAgree(event.target.checked);
                                    }
                                    }
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                            } 
                            label="I agree and give consent to store my details and get contacted in future." 
                        />
                    </Stack>
                    <div style={{ textAlign:'center', padding:'10px' }}>
                        {sRegErrorMessage && 
                            <div 
                                style={{ 
                                color: '#ff0000',
                                padding: '0px 12px 5px 12px',
                                fontSize: '12px',
                                textAlign: 'center'
                                }}
                            >
                                {sRegErrorMessage}
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
                                clearSelfRegister();
                            }}
                            // disabled={sRegLoading}
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
                            loading={sRegLoading}
                            disabled={sRegAccountId && sRegUserId && sRegUsername && sRegEmailId && sRegPhoneNumber && sRegAgree ? false : true}
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
                            Create
                        </LoadingButton>
                    </Stack>
                </form>
                <div style={{ textAlign:'center', padding:'10px' }}>
                    <Link href={config?.linkForTC} underline="hover" target="_blank">Terms and Conditions</Link>
                </div>
            </React.Fragment>
        }
    </React.Fragment>
  );
}