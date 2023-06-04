import Head from "next/head";
import styles from "../styles/Home.module.css";
import Modal from "react-modal";
import { useState } from "react";

Modal.setAppElement("#__next");

export default function Team({ team, players }) {
  console.log(team);
  console.log(players);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  function FunkcjaGracze(player) {
    setSelectedPlayer(player);
  }
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
          {players.data
            .filter((player) => player.team.id === team.id)
            .map((player) => (
              <li key={player.id} className={styles.gracz} onClick={() => FunkcjaGracze(player)}>
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
        overlayClassName={styles.modalGraczeOv}>

        <button
          className={styles.buttonClose}
          onClick={() => setSelectedPlayer(null)}>
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

  const odpPlayer = await fetch(`https://www.balldontlie.io/api/v1/players`);
  const players = await odpPlayer.json();

  return {
    props: { team, players },
  };
}
