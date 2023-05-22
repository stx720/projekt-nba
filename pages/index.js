import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home({teams}) {
  console.log(teams)
  return (

    <div className={styles.container}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Drużyny NBA</h1>
        <ul className={styles.lista}>
          {teams.data.map(team => (
            <li  key={team.name}>{team.name}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export async function getStaticProps(context) {
  const odp = await fetch("https://www.balldontlie.io/api/v1/teams")
  const teams = await odp.json()

  return{
  props: {teams}
  }
}



