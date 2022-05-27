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