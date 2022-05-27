import { Card, CardContent, Button, Typography, TextField, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Group, { GroupType } from '../../components/Group';
import styles from '../../styles/Groups.module.css';
import { groupActions } from '../../redux/slices/group-slice';
import { RootState } from '../../redux/store';
import { listGroups } from '../../services/listgroups';
import Loader from '../../components/Loader';
import { useAuth } from '../../hooks/useAuth';

export default function Groups() {
  const authenticate = useAuth();
  const dispatch = useDispatch();
  const groups = useSelector((state: RootState) => state.groups);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false)
  const [collectionRange, setCollectionRange] = useState<string>('');
  const totalGroups = +collectionRange.slice(collectionRange.indexOf('/') + 1);
  
  const totalPages = () => {
    const startIndex = collectionRange.indexOf('-') + 1;
    const endIndex = collectionRange.indexOf('/');
    const subStr = +collectionRange.slice(startIndex, endIndex);
    const fullPages = Math.floor(totalGroups/(subStr + 1));
    const extra = totalGroups%(subStr + 1) ? 1 : 0;
    return fullPages + extra;
  }

  const fetchGroups = async (offset: number, setRange: boolean) => {
    try {
      const response = await listGroups(offset);
      const groups = await response.json();
      if (!response.ok) {
        setError(true);
      } else {
        dispatch(groupActions.setGroups(groups));
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
    fetchGroups(0, true);
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const handleNavigation = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const target = e.currentTarget.name;
    
    if (target === 'prev') {
      fetchGroups((pageIndex - 2) * 10, false);
      setPageIndex(prevIndex => prevIndex - 1);
    }
    else if (target === 'next') {
      fetchGroups(pageIndex * 10, false);
      setPageIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <Typography component='div' className={styles.section_container}>
      <Typography component='div' sx={{marginBottom: 3}}>
        <Typography component='h1' className={styles.section_title}>Groups <span className={styles.groups_count}>{totalGroups}</span></Typography>
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
