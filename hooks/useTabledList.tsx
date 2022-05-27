// Custom hook to handle table data fetching, display, page navigation, and search logic

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
  // Collection range is computed from the 'X-Collection-Range' response header
  const [collectionRange, setCollectionRange] = useState<string>('');
  // Get total length of the list (data)
  const totalListLength = +collectionRange.slice(collectionRange.indexOf('/') + 1);

  // Compute total no. of pages
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
        // Function that dispatches the response data to the desired state object in the redux store
        execute(list);
        setLoading(false);
        // The conditional statement ensures that the collection range, which is used to determine the total
        // no. of pages, only runs once when the first page of the table is rendered
        if (setRange) {
          const headers = Object.fromEntries([...(response.headers as any)]);
          setCollectionRange(headers['x-collection-range']);
        }
      }
    } catch(error) {
      setError(true);
    }
  }

  // Onchange handler for the search query input field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  // Handles fetching data required by each page
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

  // Return an object of desired variables and functions
  return ({
    searchQuery, fetchList,
    pageIndex, loading, error, totalListLength,
    handleChange, handleNavigation, totalPages
  })
}