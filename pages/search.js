import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";

export default function Home({ search }) {
  const router = useRouter();
  console.log(search);
  return (
    <div className={styles.container}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <p onClick={() => router.back()} className={styles.gobackSearch}>
        <b>← Wstecz</b>
      </p>
      <main>
        <NextNProgress color="orange" />
        <p className={styles.goSearch}>
          <b>
            <Link href="search.js"></Link>
          </b>
        </p>
        <h1 className={styles.nagIndex}>Wyszukaj zawodnika:</h1>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const odpSearch = await fetch("https://www.balldontlie.io/api/v1/players");
  const search = await odpSearch.json();

  return {
    props: { search },
  };
}
