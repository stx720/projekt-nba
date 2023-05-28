import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Team({ team, players }) {
  console.log(team);
  console.log(players);
  return (
    <div className={styles.container1}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className={styles.info}>
        <h1>Informacje o drużynie:</h1>
        <h2 className={styles.heading1}>{team.full_name}</h2>
        <p>
          <b>Abbreviation:</b> {team.abbreviation}
        </p>
        <p>
          <b>City:</b> {team.city}
        </p>
        <p>
          <b>Conference:</b> {team.conference}
        </p>
        <p>
          <b>Division:</b> {team.division}
        </p>
      </div>
      <div className={styles.infoPlayers}>
        <ul className={styles.lista}>
          <h1>Lista graczy:</h1>
          {players.data.map((player) => (
            <li key={player.id}>
              {player.first_name} {player.last_name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const odp = await fetch("https://www.balldontlie.io/api/v1/teams");
  const teams = await odp.json();

  const paths = teams.data.map((team) => ({
    params: { id: team.id.toString() },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps(context) {
  const odp = await fetch(
    `https://www.balldontlie.io/api/v1/teams/${context.params.id}`
  );
  const team = await odp.json();

  const odpPlayer = await fetch(
    `https://www.balldontlie.io/api/v1/players`
  );
  const players = await odpPlayer.json();

  return {
    props: { team, players },
  };
}
