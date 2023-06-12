import Head from "next/head";
import styles from "../styles/Home.module.css";
import Modal from "react-modal";
import { useState } from "react";
import { useRouter } from "next/router";
import NextNProgress from 'nextjs-progressbar';

Modal.setAppElement("#__next");

export default function Team({ team, players, gry }) {
  console.log(team);
  console.log(players);
  console.log(gry);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const router = useRouter();

  function FunkcjaGracze(player) {
    setSelectedPlayer(player);
  }

  function FunkcjaMecz(game) {
    setSelectedGame(game);
  }

  return (
    <div className={styles.container1}>
      <Head>
        <title>NBA</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div className={styles.info}>
      <NextNProgress color='orange'/>
        <p onClick={() => router.back()} className={styles.goBack}>
          <b>← Wstecz</b>
        </p>
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

        <h1>Rozegrane mecze:</h1>
        <div className={styles.tabelkaMecz1}>
          <table className={styles.tabelkaMecz}>
            {gry.data.map((game) => (
              <tbody key={game.id}>
                <tr>
                  <th className={styles.nagTab}>Data</th>
                  <th className={styles.nagTab}>Drużyny</th>
                  <th className={styles.nagTab}>Wynik</th>
                </tr>
                <tr>
                  <td
                    onClick={() => FunkcjaMecz(game)}
                    className={styles.daneTab}
                  >
                    <p>
                      <b>Data:</b> {game.date.slice(0, 10)}
                    </p>
                  </td>
                  <td
                    onClick={() => FunkcjaMecz(game)}
                    className={styles.daneTab}
                  >
                    <p>
                      <b>{game.home_team.full_name}</b> vs{" "}
                      <b>{game.visitor_team.full_name} </b>
                    </p>
                  </td>
                  <td
                    onClick={() => FunkcjaMecz(game)}
                    className={styles.daneTab}
                  >
                    <p>
                      <b>
                        Wynik: {game.home_team_score} -{" "}
                        {game.visitor_team_score}
                      </b>
                    </p>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>

      <div className={styles.infoPlayers}>
        <ul className={styles.lista}>
          <h1>Lista graczy:</h1>
          {players.data
            .filter((player) => player.team.id === team.id)
            .map((player) => (
              <li
                key={player.id}
                className={styles.gracz}
                onClick={() => FunkcjaGracze(player)}
              >
                {player.first_name} {player.last_name}
              </li>
            ))}
        </ul>
      </div>

      <Modal
        isOpen={selectedPlayer !== null}
        onRequestClose={() => setSelectedPlayer(null)}
        contentLabel="Informacje o zawodniku"
        className={styles.modalGracze}
        overlayClassName={styles.modalGraczeOv}
      >
        <button
          className={styles.buttonClose}
          onClick={() => setSelectedPlayer(null)}
        >
          &times;
        </button>
        {selectedPlayer && (
          <div>
            <h1 className={styles.imieZawodnika}>
              <b>
                {selectedPlayer.first_name} {selectedPlayer.last_name}{" "}
              </b>
            </h1>
            <p className={styles.infoGracz}>
              <b>Drużyna: </b>
              {team.full_name}
            </p>

            <p className={styles.infoGracz}>
              <b>Pozycja:</b> {selectedPlayer.position}
            </p>
            <p className={styles.infoGracz}>
              <b>Wzrost:</b> {selectedPlayer.height_feet} feet{" "}
              {selectedPlayer.height_inches} inches
            </p>
            <p className={styles.infoGracz}>
              <b>Waga:</b> {selectedPlayer.weight_pounds} pounds
            </p>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={selectedGame !== null}
        onRequestClose={() => setSelectedGame(null)}
        contentLabel="Informacje o meczu"
        className={styles.modalGry}
        overlayClassName={styles.modalGryOv}
      >
        <button
          className={styles.buttonClose}
          onClick={() => setSelectedGame(null)}
        >
          &times;
        </button>
        {selectedGame && (
          <div>
            <h1 className={styles.naglowekMecze}>
              {selectedGame.home_team.full_name} vs{" "}
              {selectedGame.visitor_team.full_name}
            </h1>
            <p className={styles.infoGracz}>
              <b>Data:</b> {selectedGame.date.slice(0, 10)}
            </p>
            <p className={styles.infoGracz}>
              <b>Wynik:</b> {selectedGame.home_team_score} -{" "}
              {selectedGame.visitor_team_score}
            </p>

            <p className={styles.infoGracz}>
              <b>Okresy: </b> {selectedGame.period}
            </p>
            <p className={styles.infoGracz}>
              <b>Postseason: </b> {selectedGame.postseason ? "Tak" : "Nie"}
            </p>
            <p className={styles.infoGracz}>
              <b>Sezon: </b> {selectedGame.season}
            </p>
          </div>
        )}
      </Modal>
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

  const odpPlayer = await fetch(`https://www.balldontlie.io/api/v1/players?per_page=100`);
  const players = await odpPlayer.json();

  const odpGra = await fetch(
    `https://www.balldontlie.io/api/v1/games?per_page=100&team_ids[]=${context.params.id}`
  );
  const gry = await odpGra.json();
  return {
    props: { team, players, gry },
  };
}
