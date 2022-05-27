import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Button, Typography, TextField, Divider } from '@mui/material';
import { RootState } from '../../../redux/store';
import { listDoors } from '../../../services/listdoors.service';
import { doorActions } from '../../../redux/slices/door-slice';
import Door, { DoorType } from '../../../components/Door';
import styles from '../../../styles/Groups.module.css';
import { useRouter } from 'next/router';
import AddDoor from '../../../components/AddDoor';
import Loader from '../../../components/Loader';
import { useAuth } from '../../../hooks/useAuth';

export default function Doors() {
  const authenticate = useAuth();
  const dispatch = useDispatch();
  const doors = useSelector((state: RootState) => state.doors);
  const router = useRouter();
  const group_id = router.query.id;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false)
  const [collectionRange, setCollectionRange] = useState<string>('');
  const totalDoors = +collectionRange.slice(collectionRange.indexOf('/') + 1);
  const [open, setOpen] = useState<boolean>(false);

  const totalPages = () => {
    const startIndex = collectionRange.indexOf('-') + 1;
    const endIndex = collectionRange.indexOf('/');
    const subStr = +collectionRange.slice(startIndex, endIndex);
    const fullPages = Math.floor(totalDoors/(subStr + 1));
    const remainder = totalDoors%(subStr + 1) ? 1 : 0;
    return fullPages + remainder;
  }

  const fetchDoors = async (offset: number, setRange: boolean) => {
    try {
      const response = await listDoors(offset, group_id as string)
      const doors = await response.json();
      if (!response.ok) {
        setError(true);
      } else {
        dispatch(doorActions.setDoors(doors));
        setLoading(false);
        if (setRange) {
          const headers = Object.fromEntries([...(response.headers as any)]);
          setCollectionRange(headers['x-collection-range']);
        }
      }
    } catch(error) {
      setError(true);
    }
  }

  useEffect(() => {
    if (!group_id) return;
    fetchDoors(0, true);
  }, [group_id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const handleNavigation = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const target = e.currentTarget.name;
    
    if (target === 'prev') {
      fetchDoors((pageIndex - 2) * 10, false);
      setPageIndex(prevIndex => prevIndex - 1);
    }
    else if (target === 'next') {
      fetchDoors(pageIndex * 10, false);
      setPageIndex(prevIndex => prevIndex + 1);
    }
  }

  const handleOpen = () => {
    setOpen(true);
  }
  
  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Typography component='div' className={styles.section_container}>
      <Typography component='div' sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography component='div' sx={{marginBottom: 3}}>
          <Typography component='h1' className={styles.section_title}>{doors[0]?.group?.name}</Typography>
          <Typography component='p' className={styles.section_description}>Add users to groups and assign different access rights</Typography>
        </Typography>
        <Button type='button' variant='outlined' className={styles.add_group_btn} sx={{height: 38}}>Delete Group</Button>
      </Typography>

      <Card className={styles.card}>
        <CardContent>
          {
            error ?
              <Typography>
                Unfortunately, we cannot retrieve your groups at the moment. Kindly ensure that you are connected to the internet or try again later if the problem persists.
              </Typography>
            :
              <>
                <Typography component='div' className={styles.top_section}>
                  <TextField
                    className={styles.input} name='searchQuery' type='text'
                    placeholder="Search Locks..." variant="outlined" size='small' required
                    onChange={handleChange}  
                  />
                  <AddDoor open={open} handleClose={handleClose} group_id={group_id as string} />
                  <Button type='button' variant='outlined'
                    className={styles.add_group_btn}
                    onClick={handleOpen}
                  >
                    Add Doors
                  </Button>
                </Typography>
                <Divider />
                <Typography component='div' className={styles.main_section}>
                  {
                    doors.filter((door: DoorType) => door.lock.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((door: DoorType) => (
                      <Door key={door.id} door={door} />
                    ))
                  }
                </Typography>
                <Divider />
                <Typography component='div' className={styles.navigation}>
                  <Button type='button' disabled={pageIndex === 1} name='prev'
                    className={pageIndex === 1 ? styles.passive : styles.active}
                    onClick={handleNavigation}
                  >
                    Previous Page
                  </Button>
                  <Typography component='p'>{`Page ${pageIndex} of ${totalPages()}`}</Typography>
                  <Button type='button' disabled={pageIndex === totalPages()} name='next'
                    className={pageIndex === totalPages() ? styles.passive : styles.active}
                    onClick={handleNavigation}
                  >
                    Next Page
                  </Button>
                </Typography>
              </>
          }
        </CardContent>
      </Card>
      <Loader open={loading} />
    </Typography>
  )
}
