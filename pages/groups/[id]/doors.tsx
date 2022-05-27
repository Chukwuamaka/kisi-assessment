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
import useTabledList from '../../../hooks/useTabledList';

export default function Doors() {
  const dispatch = useDispatch();
  const router = useRouter();
  const group_id = router.query.id;
  const doors = useSelector((state: RootState) => state.doors);
  const req = (offset: number) => listDoors(offset, group_id as string);
  const execute = (list: DoorType[]) => dispatch(doorActions.setDoors(list));
  const { searchQuery, fetchList, pageIndex, loading, error, totalListLength, handleChange, handleNavigation, totalPages } = useTabledList(req, execute)
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  // Fetch the list of doors belonging to a group only when the group id is accessible from the url path.
  // The setRange parameter of the fetchList function is assigned to true because we want to retrieve the
  // 'X-Collection-Range' response header (once) on render of the first page of the list.
  useEffect(() => {
    if (!group_id) return;
    fetchList(0, true);
  }, [group_id])

  const handleOpen = () => {
    setOpenDialog(true);
  }
  
  const handleClose = () => {
    setOpenDialog(false);
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

      {/* Dialog component for the Add Door form and a loader (for loading states) */}
      <AddDoor open={openDialog} handleClose={handleClose} group_id={group_id as string} />
      <Loader open={loading} />
    </Typography>
  )
}
