import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import useSWR from 'swr';
import { getRequest } from '../services/default.service';
import { makeStyles } from '@mui/styles';
import { Divider } from '@mui/material';
import { getPlaceLocks } from '../services/listplacelocks';
import { addGroupLock } from '../services/addlock.service';
import CustomizedSnackbar, { SnackbarState } from './CustomizedSnackbar';
import { useRouter } from 'next/router';
import Loader from './Loader';

type AddDoorProps = {
  open: boolean;
  handleClose: () => void;
  group_id: string
}

type Place = {
  id: number;
  name: string;
}

type Door = Place;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const useStyles = makeStyles(() => ({
  dialog: {
    '& .MuiPaper-root': {
      borderRadius: 8,
      padding: '10px 0 5px'
    }
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#222647',
    paddingRight: 30,
    paddingLeft: 30
  },
  dialogContent: {
    '&.MuiDialogContent-root':{
      padding: '20px 30px',
    }
  },
  dialogActions: {
    textTransform: 'capitalize',
    fontWeight: 600,
    padding: '7px 30px',
    fontSize: 16,
  },
  select: {
    marginBottom: 30
  }
}))

const fetcher = async (...args: string[]) => {
  const [url] = args;
  const response = await getRequest(url);
  const places = await response.json();
  return places;
}

export default function AddDoor({ open, handleClose, group_id }: AddDoorProps) {
  const { data: places } = useSWR('https://api.kisi.io/places', fetcher);
  const [place, setPlace] = useState<number | string>('');
  const [doors, setDoors] = useState<Door[]>([]);
  const [door, setDoor] = useState<number | string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({open: false, type: 'success', message: 'info'});
  const router = useRouter()
  const classes = useStyles();

  const getLocks = async (place_id: number) => {
    const response = await getPlaceLocks(place_id);
    const doors = await response.json();
    setDoors(doors);
  }

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const { name, value } = event.target;
    if (name === 'place') {
      setPlace(+value);
      getLocks(+value)
    } else if (name === 'door') {
      setDoor(+value)
    };
  };

  const resetFields = () => {
    setPlace('');
    setDoor('');
  };

  const closeDialog = () => {
    resetFields();
    handleClose();
  }

  const assignLock = async () => {
    try {
      setLoading(true);
      const response = await addGroupLock({group_id: +group_id, lock_id: door});
      const data = await response.json();
      if (response.ok) {
        resetFields();
        setLoading(false);
        setSnackbar({open: true, type: 'success', message: "Lock has been added successfully!"});
        router.reload();
      }
      else {
        setSnackbar({open: true, type: 'error', message: data.message});
        setLoading(false);
      }
    } catch (error) {
      setSnackbar({open: true, type: 'error', message: 'Oops! An error ocurred. Please check your internet and try again'});
      setLoading(false);
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={closeDialog} maxWidth='sm' fullWidth className={classes.dialog}>
        <DialogTitle className={classes.dialogTitle}>Add Doors</DialogTitle>

        <DialogContent className={classes.dialogContent}>
          <FormControl fullWidth>
            <InputLabel id="select-place">Select place</InputLabel>
            <Select labelId="select-place" id="select-place" name='place' value={place}
              label="Select place" placeholder='Select place'
              className={classes.select}
              onChange={handleChange}
            >
              {places?.map((place: Place) => (
                <MenuItem key={place.id} value={place.id}>{place.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <InputLabel id="select-door">Select Door</InputLabel>
            <Select labelId="select-door" id="select-door" name='door' value={door}
              label="Select Door" placeholder='Select Door'
              className={classes.select} MenuProps={MenuProps}
              onChange={handleChange}
            >
              {doors?.map((door: Door) => (
                <MenuItem key={door.id} value={door.id}>{door.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button type='button' onClick={closeDialog} className={classes.dialogActions} sx={{color: '#4a52ff'}}>Cancel</Button>
          <Button type='button' variant='contained' onClick={assignLock} sx={{backgroundColor: '#4a52ff', ':hover': {backgroundColor: '#4a52ff'}}}
            className={classes.dialogActions} disabled={!place || !door}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Loader open={loading} />      
      <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
}
