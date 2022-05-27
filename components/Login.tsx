import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Card, CardContent, Button, Typography, TextField } from '@mui/material';
import styles from '../styles/Login.module.css';
import { authActions } from '../redux/slices/auth-slice';
import { RootState } from '../redux/store';
import { login } from '../services/login.service';
import { useState } from 'react';
import CustomizedSnackbar, { SnackbarState } from './CustomizedSnackbar';
import Loader from './Loader';

type Input = {
  name: string;
  label: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({open: false, type: 'info', message: ''});

  const inputs: Input[] = [
    {
      name: 'email',
      label: 'Email Address'
    },
    {
      name: 'password',
      label: 'Password'
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Save login details provided by the user in the redux store
    dispatch(authActions.setLoginDetails({
      [e.target.name]: e.target.value
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = {loginDetails}
      const response = await login(user);
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.authentication_token);
        setLoading(false)
        router.push('/groups');
      } else setSnackbar({open: true, type: 'error', message: data.message});
    } catch (err) {
      setLoading(false);
      setSnackbar({open: true, type: 'error', message: 'Oops! An error ocurred. Please check your internet and try again'});
    }
  }

  return (
    <Card className={styles.card}>
      <CardContent>
        <Typography component='div' className={styles.heading}>
          <Typography className={styles.welcome_back} variant='body1' component='span'>Welcome back!</Typography>
          <Image className='sign-in-icon' src='/sign_in_icon.svg' alt='' width={72} height={60} />
        </Typography>
        <Typography className={styles.cta} variant='body1' component='p'>Enter your details to get signed in to your account</Typography>
        <form className={styles.form} onSubmit={handleSubmit}>
          {inputs.map(input => (
            <TextField
              key={input.name} className={styles.input} id={input.name} name={input.name}
              type={input.name} label={input.label} variant="outlined" size='small' required
              onChange={handleChange}  
            />
          ))}
          <Button id={styles.login_btn} type='submit' variant='contained'>Log In</Button>
        </form>
      </CardContent>

      <Loader open={loading} />      
      <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </Card>
  )
}
