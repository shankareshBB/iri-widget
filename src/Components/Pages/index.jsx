import React from 'react'
// Material UI 
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { Avatar, FormGroup, Stack } from '@mui/material';
// images
import IRIClose from '../../assets/close-button.png';
import IRIPush from '../../assets/001-notification.png';
import IRIMail from '../../assets/002-email.png';
// files
import axios from 'axios';
import SelfRegPage from './SelfRegister';
import LoginPage from './Login';
import ActivateTokenPage from './ActivateToken';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '1.6rem',
    backgroundColor: '#fff',
  },
}));
  
export default function FirstPageIndex(props) {
  // consumer data
  const { config, largeScreen, proceedBtnPopup, setProceedBtnPopup, tokenValue, setTokenValue, isAllowed, widgetStatusDisplay, setWidgetStatusDisplay } = props;

  const onResponse = config?.onResponse
    ? config.onResponse
    : (data) => {
        console.log("Xpay Response ::> ", data);
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

    // Page using 0 for home page 1 for activate token and 2 for login and 3 for self registration
    const [page, setPage] = React.useState(0);

  // Self registration form values and error/success message
  const [sRegAccountId, setSRegAccountId] = React.useState('');
  const [sRegUserId, setSRegUserId] = React.useState('');
  const [sRegUsername, setSRegUsername] = React.useState('');
  const [sRegEmailId, setSRegEmailId] = React.useState('');
  const [sRegPhoneNumber, setSRegPhoneNumber] = React.useState('');
  const [sRegAgree, setSRegAgree] = React.useState(false);
  const [sRegErrorMessage, setSRegErrorMessage] = React.useState('');
  const [sRegShowSuccessMessage, setSRegShowSuccessMessage] = React.useState(false);

  // Login form values and error/success message
  const [loginAccountId, setLoginAccountId] = React.useState('');
  const [loginEmailId, setLoginEmailId] = React.useState('');
  const [loginErrorMessage, setLoginErrorMessage] = React.useState('');
  const [loginUserDetails, setLoginUserDetails] = React.useState({});
  const loginMethods = [
    {
      id: '1',
      name: 'Email OTP',
      image: IRIMail
    },
    {
      id: '2',
      name: 'Push',
      image: IRIPush
    },
  ];
  const [loginSelectedMethod, setLoginSelectedMethod] = React.useState('');
  const [loginAppId, setLoginAppId] = React.useState('');
  const [loginOTPDetails, setLoginOTPDetails] = React.useState('');
  const [loginOTP, setLoginOTP] = React.useState('');

  // Activate token form values and error/success message
  const [actTokenAccountId, setActTokenAccountId] = React.useState('');
  const [actTokenEmailId, setActTokenEmailId] = React.useState('');
  const [actTokenErrorMessage, setActTokenErrorMessage] = React.useState('');
  const [actTokenUserDetails, setActTokenUserDetails] = React.useState({});
  const [actTokenAppDetails, setActTokenAppDetails] = React.useState([]);
  const [actTokenAppId, setActTokenAppId] = React.useState('');
  const [actTokenOTPDetails, setActTokenOTPDetails] = React.useState('');
  const [actTokenOTP, setActTokenOTP] = React.useState('');

  const handleClearAll = () => {
    setPage(0);                  // Page goes to the beginning of the widget 
    setTokenValue("");           // clear JWT token 
    setWidgetStatusDisplay('');  // clear error msg of popup

    setSRegAccountId('');        // clear form value of self registration
    setSRegUserId('');           // clear form value of self registration
    setSRegUsername('');         // clear form value of self registration
    setSRegEmailId('');          // clear form value of self registration
    setSRegPhoneNumber('');      // clear form value of self registration
    setSRegAgree(false);         // clear form value of self registration
    setSRegErrorMessage('');     // clear error message of self registration
    setSRegShowSuccessMessage(false); // clear success message of self registration
    
    setLoginAccountId('');       // clear form value of login
    setLoginEmailId('');         // clear form value of login
    setLoginErrorMessage('');    // clear error message of login
    setLoginUserDetails({});     // clear api response of get user by type
    setLoginSelectedMethod('');  // clear selected method of login
    setLoginOTPDetails('');      // clear api response of generate token
    setLoginAppId('');           // clear selected application id
    setLoginOTP('');             // clear form value of login
    
    setActTokenAccountId('');    // clear form value of activate token
    setActTokenEmailId('');      // clear form value of activate token
    setActTokenErrorMessage(''); // clear error message of activate token
    setActTokenUserDetails({});  // clear api response of get user by type
    setActTokenAppDetails([]);   // clear api response of all assigned applications
    setActTokenOTPDetails('');   // clear api response of generate token
    setActTokenAppId('');        // clear selected application id
    setActTokenOTP('');          // clear form value of activate token
  };
  
  return (
    <>
      {proceedBtnPopup && <BootstrapDialog
        fullScreen={largeScreen?false:true}
        aria-labelledby="customized-checkout"
        open={proceedBtnPopup}
        PaperProps={{
          style:{
            borderRadius: largeScreen?'1.6rem':'0rem',
          }
        }}
      >
        {/* --------- CLOSE ICON --------- */}
        <IconButton
          aria-label="close"
          onClick={()=>{
            setProceedBtnPopup(false);
            handleClearAll();
          }}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            // color: '#fff',
          }}
        >
          <Avatar 
            src={IRIClose}
            alt="Close"
            // style={{
            //   margin: "0px",
            //   width: "25px",
            //   height: "25px",
            // }} 
          />
        </IconButton>
        {/* --------- CLOSE ICON --------- */}

        <DialogContent 
          style={{
            backgroundColor:'#fff',
            borderRadius:'1.6rem 1.6rem 0 0',
            padding:'26px',
            // minWidth:'500px'
          }}
        >
          <React.Fragment>
            {/* --------- REGISTRATION PAGE 3 --------- */}
            {page===3 &&
              <SelfRegPage 
                config={config}
                proceedBtnPopup={proceedBtnPopup}
                setProceedBtnPopup={setProceedBtnPopup}
                largeScreen={largeScreen}
                tokenValue={tokenValue}
                page={page}
                setPage={setPage}

                sRegAccountId={sRegAccountId}
                setSRegAccountId={setSRegAccountId}
                sRegUserId={sRegUserId}
                setSRegUserId={setSRegUserId}
                sRegUsername={sRegUsername}
                setSRegUsername={setSRegUsername}
                sRegEmailId={sRegEmailId}
                setSRegEmailId={setSRegEmailId}
                sRegPhoneNumber={sRegPhoneNumber}
                setSRegPhoneNumber={setSRegPhoneNumber}
                sRegAgree={sRegAgree}
                setSRegAgree={setSRegAgree}
                sRegErrorMessage={sRegErrorMessage}
                setSRegErrorMessage={setSRegErrorMessage}
                sRegShowSuccessMessage={sRegShowSuccessMessage}
                setSRegShowSuccessMessage={setSRegShowSuccessMessage}
              />
            }

            {/* --------- LOGIN PAGE 2 --------- */}
            {page===2 &&
              <LoginPage 
                config={config}
                proceedBtnPopup={proceedBtnPopup}
                setProceedBtnPopup={setProceedBtnPopup}
                largeScreen={largeScreen}
                tokenValue={tokenValue}
                page={page}
                setPage={setPage}
                
                appType={1}
                loginAccountId={loginAccountId}
                setLoginAccountId={setLoginAccountId}
                loginEmailId={loginEmailId}
                setLoginEmailId={setLoginEmailId}
                loginErrorMessage={loginErrorMessage}
                setLoginErrorMessage={setLoginErrorMessage}
                loginUserDetails={loginUserDetails}
                setLoginUserDetails={setLoginUserDetails}
                loginMethods={loginMethods}
                loginSelectedMethod={loginSelectedMethod}
                setLoginSelectedMethod={setLoginSelectedMethod}
                
                loginAppId={loginAppId}
                setLoginAppId={setLoginAppId}
                loginOTP={loginOTP}
                setLoginOTP={setLoginOTP}
                loginOTPDetails={loginOTPDetails}
                setLoginOTPDetails={setLoginOTPDetails}
              />
            }

            {/* --------- ACTIVATE TOKEN PAGE 1 --------- */}
            {page===1 &&
              <ActivateTokenPage 
                config={config}
                proceedBtnPopup={proceedBtnPopup}
                setProceedBtnPopup={setProceedBtnPopup}
                largeScreen={largeScreen}
                tokenValue={tokenValue}
                page={page}
                setPage={setPage}
                appType={1}
                actTokenAccountId={actTokenAccountId}
                setActTokenAccountId={setActTokenAccountId}
                actTokenEmailId={actTokenEmailId}
                setActTokenEmailId={setActTokenEmailId}
                actTokenErrorMessage={actTokenErrorMessage}
                setActTokenErrorMessage={setActTokenErrorMessage}
                actTokenUserDetails={actTokenUserDetails}
                setActTokenUserDetails={setActTokenUserDetails}
                actTokenAppDetails={actTokenAppDetails}
                setActTokenAppDetails={setActTokenAppDetails}
                actTokenAppId={actTokenAppId}
                setActTokenAppId={setActTokenAppId}
                actTokenOTP={actTokenOTP}
                setActTokenOTP={setActTokenOTP}
                actTokenOTPDetails={actTokenOTPDetails}
                setActTokenOTPDetails={setActTokenOTPDetails}
              />
            }
            
            {/* --------- HOME PAGE 0 --------- */}
            {page===0 &&
            <Stack spacing={2}>
                <div style={{ marginTop:'15px', marginRight:largeScreen?'6rem':'1rem' }}>
                    <h1 >Welcome to Axiom protect 2.0</h1>
                    <h1 >Self Registration</h1>
                    <p >Activate your absolute security. <br/>Please keep your phone ready and online.
                    </p>
                </div>

                <Stack spacing={2} style={{ width:largeScreen?'80%':'100%'}}>
                    <Stack direction="row" spacing={2}>
                        <Button 
                            variant='contained'
                            fullWidth
                            onClick={() => {
                                setPage(1);
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
                            Activate Token
                        </Button>

                        <Button 
                            variant='contained'
                            fullWidth
                            onClick={() => {
                                setPage(2);
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
                            Login
                        </Button>
                    </Stack>
                    <Button 
                        variant='contained'
                        fullWidth
                        onClick={() => {
                            setPage(3);
                        }}
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
                        Create My Account 
                    </Button>
                </Stack>
            </Stack>
            }
          </React.Fragment>
        </DialogContent>

        {/* <DialogActions 
          style={{ 
            // justifyContent:openCreateAccount?'space-between':'flex-end', 
            justifyContent:'space-between',
            minHeight:'30px', 
            padding: '8px 16px 12px' 
          }}
        >
          <div style={{ color:'#ffc107',fontSize:'13px' }}>Version:1.0.0</div>

        </DialogActions> */}
      </BootstrapDialog>}
    </>
  );
}