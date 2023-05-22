import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Team({team, players}) {
  console.log(team)
  console.log(players)
  return (

    <div className={styles.container}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1>{team.full_name}</h1>
        <ul>
          {players.data.map(player => (
            <li key={player.id}>{player.first_name} {player.last_name}</li>
          ))}
        </ul>
      </main>
    </div>
  )
}


export async function getStaticPaths() {
  const odp = await fetch("https://www.balldontlie.io/api/v1/teams");
  const teams = await odp.json();

  const paths = teams.data.map(team => ({
    params: {id: team.id.toString()}
  }))
  return {paths, fallback:false};
}

export async function getStaticProps(context) {
  const odp = await fetch(`https://www.balldontlie.io/api/v1/teams/${context.params.id}`)
  const team = await odp.json()

  const odpPlayer = await fetch(`https://www.balldontlie.io/api/v1/players?team_id=${context.params.id}>`)
  const players = await odpPlayer.json()

  return{
  props: {team, players}
  
  }
}



