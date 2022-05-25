import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Card, CardContent, Button, Typography, TextField } from '@mui/material';
import styles from '../styles/Login.module.css';
import { makeStyles } from '@material-ui/styles';
import { authActions } from '../redux/auth-slice';
import { RootState } from '../redux/store';
import { login } from '../services/login.service';

type Input = {
  name: string;
  label: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginDetails = useSelector((state: RootState) => state.auth);

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
    dispatch(authActions.setLoginDetails({
      [e.target.name]: e.target.value
    }));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    try {
      const response = await login(loginDetails);
      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('token', data.authentication_token);
        router.push('/groups');
      }
    } catch (err) {
      console.log(err)
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
          {
            inputs.map(input => (
              <TextField
                key={input.name} className={styles.input} id={input.name} name={input.name}
                type={input.name} label={input.label} variant="outlined" size='small' required
                onChange={handleChange}  
              />
            ))
          }
          <Button id={styles.login_btn} type='submit' variant='contained'>Log In</Button>
        </form>
      </CardContent>
    </Card>
  )
}
