import { Card, CardContent, Button, Typography, TextField, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Group, { GroupType } from '../../components/Group';
import styles from '../../styles/Groups.module.css';
import { groupActions } from '../../redux/slices/group-slice';
import { RootState } from '../../redux/store';
import { listGroups } from '../../services/listgroups';
import Loader from '../../components/Loader';
import useTabledList from '../../hooks/useTabledList';

export default function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state: RootState) => state.groups);
  const req = (offset: number) => listGroups(offset);
  const execute = (list: GroupType[]) => dispatch(groupActions.setGroups(list));
  const { searchQuery, fetchList, pageIndex, loading, error, totalListLength, handleChange, handleNavigation, totalPages } = useTabledList(req, execute)

  useEffect(() => {
    fetchList(0, true);
  }, [])

  return (
    <Typography component='div' className={styles.section_container}>
      <Typography component='div' sx={{marginBottom: 3}}>
        <Typography component='h1' className={styles.section_title}>Groups <span className={styles.groups_count}>{totalListLength}</span></Typography>
        <Typography component='p' className={styles.section_description}>Add users to groups and assign different access rights</Typography>
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
                    placeholder="Search Groups..." variant="outlined" size='small' required
                    onChange={handleChange}  
                  />
                  <Button type='button' variant='outlined' className={styles.add_group_btn}>Add Group</Button>
                </Typography>
                <Divider />
                <Typography component='div' className={styles.main_section}>
                  {
                    groups.filter((group: GroupType) => group.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((group: GroupType) => (
                      <Group key={group.id} group={group} />
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
