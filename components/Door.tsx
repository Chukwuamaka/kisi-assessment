import { Typography } from '@mui/material';
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AdUnitsOutlinedIcon from '@mui/icons-material/AdUnitsOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from '../styles/Door.module.css';
import { deleteGroupLock } from '../services/deletelock.service';
import { useState } from 'react';
import CustomizedSnackbar, { SnackbarState } from './CustomizedSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { doorActions } from '../redux/slices/door-slice';
import { RootState } from '../redux/store';
import CustomPopover, { usePopover } from '../hooks/usePopover';
import IconPopoverWrapper from './IconPopoverWrapper';

export type DoorType = {
  id: number;
  lock: {
    name: string;
    description: string;
  },
  place: {
    name: string;
  },
  group: {
    id: number;
    name: string;
  }
}

type DoorProps = {
  door: DoorType;
}

export default function Door({door}: DoorProps) {
  const dispatch = useDispatch();
  const doors = useSelector((state: RootState) => state.doors);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({open: false, type: 'success', message: ''});
  const { open, anchorEl, message, openPopover, closePopover } = usePopover();

  // Delete or deassign lock
  const deAssignLock = async () => {
    try {
      const response = await deleteGroupLock(door.id);
      if (response.ok) {
        setLoading(false);
        // Notify user when the operation is complete
        setSnackbar({open: true, type: 'success', message: "Lock has been deleted from this group!"});
        const newDoors = doors.filter((item: DoorType) => item.id !== door.id);
        // Update the redux store after 0.5s, so that the store update does not interfere with the snackbar notification
        setTimeout(() => dispatch(doorActions.setDoors(newDoors)), 500)
      }
    } catch (error) {
      setSnackbar({open: true, type: 'error', message: 'Oops! An error ocurred. Please check your internet and try again'});
    }
  }

  return (
    <Typography component='div' className={styles.door_container}>
      <Typography component='div'>
        <SensorDoorOutlinedIcon sx={{fontSize: '180%', marginRight: 3, verticalAlign: 'super'}} />
        <Typography variant='body1' component='div' className='d-inline-block'>
          <Typography variant='body1' component='p' className={styles.lock_name}>
            {door.lock.name}
          </Typography>
          <Typography variant='body1' component='p'>
            <Typography component='span' className={styles.lock_description}>
              {door.lock.description}
            </Typography>
            <Typography component='span' className={styles.place_description}>
              {door.place.name}
            </Typography>
          </Typography>
        </Typography>
      </Typography>
      
      <Typography component='div' className={styles.icons_container}>
        <IconPopoverWrapper open={open} message='Geofence restriction' closePopover={closePopover} openPopover={openPopover}>
          <LocationOnOutlinedIcon className={styles.icons} />
        </IconPopoverWrapper>
        <IconPopoverWrapper open={open} message='Reader restriction' closePopover={closePopover} openPopover={openPopover}>
          <AdUnitsOutlinedIcon className={styles.icons} />
        </IconPopoverWrapper>
        <IconPopoverWrapper open={open} message='Unassign door from group' closePopover={closePopover} openPopover={openPopover}>
          <DeleteIcon className={styles.icons} onClick={deAssignLock} />
        </IconPopoverWrapper>
        <CustomPopover open={open} anchorEl={anchorEl} message={message} closePopover={closePopover} />
      </Typography>

      <CustomizedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </Typography>
  )
}