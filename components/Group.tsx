import GroupsIcon from '@mui/icons-material/Groups';
import { Typography } from '@mui/material';
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhonelinkLockOutlinedIcon from '@mui/icons-material/PhonelinkLockOutlined';
import AdUnitsOutlinedIcon from '@mui/icons-material/AdUnitsOutlined';
import styles from '../styles/Group.module.css';
import Link from 'next/link';
import IconPopover from './IconPopover';
import CustomPopover, { usePopover } from '../hooks/usePopover';

export type GroupType = {
  name: string;
  description: string;
  locks_count: number;
  members_count: number;
  id: number;
}

type GroupProps = {
  group: GroupType;
}

export default function Group({group}: GroupProps) {
  const { open, anchorEl, message, openPopover, closePopover } = usePopover();

  return (
    <Link key={group.id} href={`/groups/${group.id}/doors`}>
      <Typography component='div' className={styles.group_container}>
        <Typography component='div'>
          <GroupsIcon sx={{fontSize: '180%', marginRight: 3}} />
          <Typography variant='body1' component='div' className='d-inline-block'>
            <Typography variant='body1' component='p' className={styles.group_name}>{group.name}</Typography>
            <Typography variant='body1' component='p' className={styles.group_description}>{group.description}</Typography>
          </Typography>
        </Typography>

        <Typography component='div'>
          <Typography component='p' className='d-inline-block' sx={{marginRight: 1}}>
            <IconPopover open={open} message='Doors' closePopover={closePopover} openPopover={openPopover}>
              <SensorDoorOutlinedIcon className={styles.icons} />
            </IconPopover>
            <Typography component='span'>{group.locks_count}</Typography>
          </Typography>
          <Typography component='p' className='d-inline-block'>
            <IconPopover open={open} message='Users' closePopover={closePopover} openPopover={openPopover}>
              <PeopleOutlineIcon className={styles.icons} />
            </IconPopover>
            <Typography component='span'>{group.members_count}</Typography>
          </Typography>
        </Typography>
        
        <Typography component='div'>
          <IconPopover open={open} message='Time restriction' closePopover={closePopover} openPopover={openPopover}>
            <AccessTimeOutlinedIcon className={styles.icons} />
          </IconPopover>
          <IconPopover open={open} message='Geofence restriction' closePopover={closePopover} openPopover={openPopover}>
            <LocationOnOutlinedIcon className={styles.icons} />
          </IconPopover>
          <IconPopover open={open} message='Primary device restriction' closePopover={closePopover} openPopover={openPopover}>
            <PhonelinkLockOutlinedIcon className={styles.icons} />
          </IconPopover>
          <IconPopover open={open} message='Reader restriction' closePopover={closePopover} openPopover={openPopover}>
            <AdUnitsOutlinedIcon className={styles.icons} />
          </IconPopover>
        </Typography>
        
        <CustomPopover open={open} anchorEl={anchorEl} message={message} closePopover={closePopover} />
      </Typography>
    </Link>
  )
}
