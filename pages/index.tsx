import Login from '../components/Login';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useAuth } from '../hooks/useAuth';

export default function Home() {
  const authenticate = useAuth();

  return (
    <div className={styles.container}>
      <Head>
        <title>Kisi Assessment</title>
        <meta name="description" content="Kisi Web Development Challenge" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Login />
      </main>
    </div>
  )
}
