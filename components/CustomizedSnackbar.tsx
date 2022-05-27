import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import { Dispatch, forwardRef, SetStateAction, useState } from 'react';

export type SnackbarState = {
  open: boolean;
  type: string;
  message: string;
}

type CustomizedSnackbarProps = {
  snackbar: SnackbarState;
  setSnackbar: Dispatch<SetStateAction<SnackbarState>>
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbar({ snackbar, setSnackbar }: CustomizedSnackbarProps) {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar({open: false, type: 'info', message: ""});
  };

  return (
    <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={snackbar.type as AlertColor} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}