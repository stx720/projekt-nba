import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
export default function Home({ teams }) {
  console.log(teams);
  return (
    <div className={styles.container}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main>
        <h1 className={styles.nagIndex}>Drużyny NBA</h1>
        <ul className={styles.lista}>
          {teams.data.map((team) => (
            <li className={styles.elementListy} key={team.full_name}>
              <Link className={styles.linkteam} href={`/${team.id}`}>
                {team.full_name}
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
