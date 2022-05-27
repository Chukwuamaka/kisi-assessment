// Custom hook to ensure that user is authenticated when visiting a private route

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuth() {
  const router = useRouter();

  return (
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.token;
        if (!token) {
          router.push('/');
        }
      }
    }, [])
  )
}