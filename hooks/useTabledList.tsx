import { useState } from "react";
import { useAuth } from "./useAuth";

type Req = (offset: number) => Promise<Response>;
type Execute = (list: []) => { payload: any; type: string; };

export default function useTabledList(req: Req, execute: Execute) {
  const authenticate = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false)
  const [collectionRange, setCollectionRange] = useState<string>('');
  const totalListLength = +collectionRange.slice(collectionRange.indexOf('/') + 1);

  const totalPages = () => {
    const startIndex = collectionRange.indexOf('-') + 1;
    const endIndex = collectionRange.indexOf('/');
    const subStr = +collectionRange.slice(startIndex, endIndex);
    const fullPages = Math.floor(totalListLength/(subStr + 1));
    const remainder = totalListLength%(subStr + 1) ? 1 : 0;
    return fullPages + remainder;
  }

  const fetchList = async (offset: number, setRange: boolean) => {
    try {
      const response = await req(offset);
      const list = await response.json();
      if (!response.ok) {
        setError(true);
      } else {
        execute(list);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  const handleNavigation = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const target = e.currentTarget.name;
    
    if (target === 'prev') {
      fetchList((pageIndex - 2) * 10, false);
      setPageIndex(prevIndex => prevIndex - 1);
    }
    else if (target === 'next') {
      fetchList(pageIndex * 10, false);
      setPageIndex(prevIndex => prevIndex + 1);
    }
  }

  return ({
    searchQuery, fetchList,
    pageIndex, loading, error, totalListLength,
    handleChange, handleNavigation, totalPages
  })
}