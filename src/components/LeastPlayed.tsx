import { Link } from 'react-router-dom';

interface gameProps {
  gameId: number;
  gameName: string;
  imageUrl: string;
  amountPlayed: number;
  // dateLastPlayed: string;
}

export default function LeastPlayed(props: gameProps) {
  return (
    <div className="game-info-card">
      <img
        className="game-box-image"
        alt={props.gameName}
        src={props.imageUrl}
      ></img>
      <Link
        className="search-result-link"
        to={`/games/${props.gameId}`}
        key={props.gameId}
      >
        <h2>{props.gameName}</h2>
      </Link>
      <h6>Times Played: {props.amountPlayed}</h6>
      {/* <h6>Date Last Played: {props.dateLastPlayed}</h6> */}
    </div>
  );
}