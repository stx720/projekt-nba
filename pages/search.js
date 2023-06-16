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
  const [hoveredPlayer, setHoveredPlayer] = useState(null);
  const [hoveredFavoritePlayer, setHoveredFavoritePlayer] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (player) => {
    setFavorites([...favorites, player]);
    toast.success("Dodano zawodnika do ulubionych");
  };

  const removeFromFavorites = (player) => {
    const updatedFavorites = favorites.filter(
      (favPlayer) => favPlayer.id !== player.id
    );
    setFavorites(updatedFavorites);
    toast.error("Usunięto zawodnika z ulubionych");
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm) {
      toast.error("Wprowadź imię lub nazwisko zawodnika");
      return;
    }

    const odpSearch = await fetch(
      `https://www.balldontlie.io/api/v1/players?search=${searchTerm}&per_page=100`
    );
    const search = await odpSearch.json();

    setSearchResults(search.data || []);
  };
  console.log(teams);
  return (
    <div className={styles.searchContainer}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <p onClick={() => router.back()} className={styles.gobackSearch}>
        <b>← Wstecz</b>
      </p>
      <main>
        <NextNProgress color="orange" />

        <h1 className={styles.nagIndex}>Wyszukaj zawodnika:</h1>
        <form className={styles.formSearch} onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Szukaj zawodnika..."
            className={styles.inputSearch}
          />
          <button className={styles.buttonSearch} type="submit">
            <Image src="/search.svg" width={25} height={15} />
          </button>
        </form>
        {searchResults.length > 0 && (
          <ul className={styles.ulSearch}>
            {searchResults.map((player, index) => (
              <li
                className={styles.wynikSearch}
                key={player.id}
                onMouseEnter={() => setHoveredPlayer(index)}
                onMouseLeave={() => setHoveredPlayer(null)}
              >
                {player.first_name} {player.last_name}
                {hoveredPlayer === index && (
                  <Image
                    className={styles.ulubPrzycisk}
                    src={`/star.svg`}
                    width={16}
                    height={16}
                    onClick={() => addToFavorites(player)}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
        <div className={styles.favoritesContainer}>
          {favorites.length === 0 ? (
            <p className={styles.noFavorites}></p>
          ) : (
            <ul className={styles.favoritesList}>
              <h2>Ulubieni zawodnicy:</h2>
              {favorites.map((player, index) => (
                <li
                  className={styles.favoritePlayer}
                  key={player.id}
                  onMouseEnter={() => setHoveredFavoritePlayer(index)}
                  onMouseLeave={() => setHoveredFavoritePlayer(null)}
                >
                  {player.first_name} {player.last_name}
                  {hoveredFavoritePlayer === index && (
                    <Image
                      className={styles.favPrzycisk}
                      src={`/delete.svg`}
                      width={13}
                      height={13}
                      onClick={() => removeFromFavorites(player)}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
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
