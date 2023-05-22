import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
export default function Home({ teams }) {
  console.log(teams);
  return (
    <div className={styles.container}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1>Drużyny NBA</h1>
        <ul className={styles.lista}>
          {teams.data.map((team) => (
            <li key={team.name}>
              <Link className={styles.linkteam} href={`/${team.id}`}>
                {team.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const odp = await fetch("https://www.balldontlie.io/api/v1/teams");
  const teams = await odp.json();

  return {
    props: { teams },
  };
}
