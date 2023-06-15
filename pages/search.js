import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import NextNProgress from "nextjs-progressbar";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Home({ teams }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm) {
      toast.error("Wprowadź imię lub nazwisko zawodnika");
      return;
    }

    const odpSearch = await fetch(
      `https://www.balldontlie.io/api/v1/players?search=${searchTerm}`
    );
    const search = await odpSearch.json();

    setSearchResults(search.data || []);
  };
  console.log(teams);
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
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Szukaj zawodnika..."
            className={styles.inputSearch}
          />
          <button className={styles.buttonSearch} type="submit">
            Wyszukaj
          </button>
        </form>
        {searchResults.length > 0 && (
          <ul className={styles.ulSearch}>
            {searchResults.map((player) => (
              <li key={player.id}>
                {player.first_name} {player.last_name}
              </li>
            ))}
          </ul>
        )}
      </main>
      <ToastContainer />
    </div>
  );
}

export async function getStaticProps() {
  const odp = await fetch("https://www.balldontlie.io/api/v1/teams");
  const teams = await odp.json();

  return {
    props: { teams },
  };
}
