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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { CardActionArea, Avatar, Stack } from '@mui/material';
// images
import IRIClose from '../../assets/close-button.png';
// import IRIPush from '../../assets/001-notification.png';
// import IRIMail from '../../assets/002-email.png';
// import IRISoft from '../../assets/003-soft.png';
import IRIAxiomProtect from '../../assets/axiom_protect_logo.png';
import IRIGoogleAuthToken from '../../assets/Google_Authenticator_for_Android_icon.svg.png';
import IRIMicrosoftAuthToken from '../../assets/MicrosoftMFA.webp';
// files
import SelfRegPage from './SelfRegister';
// import LoginPage from './Login';
import ActivateTokenPage from './ActivateToken';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '1.6rem',
    backgroundColor: '#fff',
  },
}));
  
export default function FirstPageIndex(props) {
  // consumer data
  const { config, largeScreen, proceedBtnPopup, setProceedBtnPopup } = props;

  // get token value used for self registration
  const [tokenValue, setTokenValue] = React.useState('');

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
  // const [loginEmailId, setLoginEmailId] = React.useState('');
  // const [loginErrorMessage, setLoginErrorMessage] = React.useState('');
  // const [loginUserDetails, setLoginUserDetails] = React.useState({});
  // const loginMethods = [
  //   {
  //     id: '1',
  //     name: 'Email OTP',
  //     image: IRIMail,
  //     category:3
  //   },
  //   {
  //     id: '2',
  //     name: 'Soft OTP',
  //     image: IRISoft,
  //     category:1
  //   },
  //   {
  //     id: '3',
  //     name: 'Push',
  //     image: IRIPush,
  //     category:0 //no category
  //   },
  // ];
  // const [loginSelectedMethod, setLoginSelectedMethod] = React.useState('');
  // const [loginPushId, setLoginPushId] = React.useState('');
  // const [loginPushStatusDetails, setLoginPushStatusDetails] = React.useState({});
  // const [loginOTP, setLoginOTP] = React.useState('');

  // Activate token form values and error/success message
  const actTokenTokenChoices = [
    {
      type:1,
      name:'Axiom Protect Absolute Token',
      title:'Activate Axiom Token',
      image:IRIAxiomProtect
    },
    {
      type:7,
      name:'Google Authentication Token',
      title:'Activate Google Token',
      image:IRIGoogleAuthToken
    },
    {
      type:7,
      name:'Microsoft Authentication Token',
      title:'Activate Microsoft Token',
      image:IRIMicrosoftAuthToken
    }
  ];
  const [actTokenAppType, setActTokenAppType] = React.useState({});
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

    setSRegAccountId('');        // clear form value of self registration
    setSRegUserId('');           // clear form value of self registration
    setSRegUsername('');         // clear form value of self registration
    setSRegEmailId('');          // clear form value of self registration
    setSRegPhoneNumber('');      // clear form value of self registration
    setSRegAgree(false);         // clear form value of self registration
    setSRegErrorMessage('');     // clear error message of self registration
    setSRegShowSuccessMessage(false); // clear success message of self registration
    
    // setLoginEmailId('');         // clear form value of login
    // setLoginErrorMessage('');    // clear error message of login
    // setLoginUserDetails({});     // clear api response of get user by type
    // setLoginSelectedMethod('');  // clear selected method of login
    // setLoginPushStatusDetails({});// clear api response of push status
    // setLoginPushId('');          // clear api response push id
    // setLoginOTP('');             // clear form value of login
    
    setActTokenAppType({});      // clear selected app type of token
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
            style={{
            //   margin: "0px",
              width: "25px",
              height: "25px",
            }} 
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
                setTokenValue={setTokenValue}
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
            {/* {page===2 &&
              <LoginPage 
                config={config}
                proceedBtnPopup={proceedBtnPopup}
                setProceedBtnPopup={setProceedBtnPopup}
                largeScreen={largeScreen}
                tokenValue={tokenValue}
                setTokenValue={setTokenValue}
                page={page}
                setPage={setPage}
                
                appType={1}
                loginEmailId={loginEmailId}
                setLoginEmailId={setLoginEmailId}
                loginErrorMessage={loginErrorMessage}
                setLoginErrorMessage={setLoginErrorMessage}
                loginUserDetails={loginUserDetails}
                setLoginUserDetails={setLoginUserDetails}
                loginMethods={loginMethods}
                loginSelectedMethod={loginSelectedMethod}
                setLoginSelectedMethod={setLoginSelectedMethod}
                loginPushId={loginPushId}
                setLoginPushId={setLoginPushId}
                loginOTP={loginOTP}
                setLoginOTP={setLoginOTP}
                loginPushStatusDetails={loginPushStatusDetails}
                setLoginPushStatusDetails={setLoginPushStatusDetails}
              />
            } */}

            {/* --------- ACTIVATE TOKEN PAGE 1 --------- */}
            {page===1 &&
              <React.Fragment>
                {actTokenAppType?.type>0 ?
                  <ActivateTokenPage 
                    config={config}
                    proceedBtnPopup={proceedBtnPopup}
                    setProceedBtnPopup={setProceedBtnPopup}
                    largeScreen={largeScreen}
                    tokenValue={tokenValue}
                    setTokenValue={setTokenValue}
                    page={page}
                    setPage={setPage}
                    appType={actTokenAppType?.type}
                    appTitle={actTokenAppType?.title}
                    setActTokenAppType={setActTokenAppType}
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
                :
                  <Stack spacing={2}>
                    <div style={{ marginTop:'15px', minWidth:largeScreen?'400px':'auto' }}>
                      <Typography variant="h6" component="div">Select Your Token Choice</Typography>
                      <Grid container justifyContent="center" spacing={4} sx={{ py:2 }}>
                        {actTokenTokenChoices.map((tok, index) => (
                          <Grid key={index} item>
                            <Card elevation={3} sx={{ maxWidth:180 }}>
                              <CardActionArea onClick={()=>{ setActTokenAppType(tok) }}>
                                <center style={{ paddingTop:'5px' }}>
                                  <img 
                                    src={tok?.image}
                                    alt={tok?.name}
                                    width={120}
                                  />
                                </center>
                                <CardContent>
                                  <Typography gutterBottom variant="subtitle2" component="div">
                                    {tok?.name}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </Stack>
                }
              </React.Fragment>
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

                        {/* {config?.showLogin && <Button 
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
                        </Button>} */}
                    </Stack>
                    <Button 
                        variant='contained'
                        fullWidth
                        onClick={() => {
                            setPage(3);
                        }}
                        sx={{
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
      </BootstrapDialog>}
    </>
  );
}