import { useEffect, useState } from 'react';
import VoteCard from '../components/VoteCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/GameCard';
import useLocalStorage from 'use-local-storage';
import Button from '@mui/material/Button';
import dateFormat from 'dateformat';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
interface gameNightProps {
  token: string;
}

export default function VotingForm(props: gameNightProps) {
  const [guestPick, setGuestPick] = useState(true);
  const [guestList, setGuestList] = useState<any[]>([]);
  const [gameList, setGameList] = useState([]);
  const [gameNightPk, setGameNightPk] = useState(0);
  const [guest, setGuest] = useState('');
  const [voter, setVoter] = useState(0);
  const [votes, setVotes] = useState<any[]>([]);
  const [attending, setAttending] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [eventStatus, setEventStatus] = useState('');
  const [voted, setVoted] = useLocalStorage('gameNightHasVoted', false);
  const [emailError, setEmailError] = useState('');
  const [finalGames, setFinalGames] = useState<any[]>([]);
  const [gameNightDate, setGameNightDate] = useState('');
  const [gameNightLoc, setGameNightLoc] = useState('');
  const [gameNightTime, setGameNightTime] = useState('');
  const [host, setHost] = useState('');

  let { gameId } = useParams();
  let convertTime = require('convert-time');

  useEffect(() => {
    console.log(gameId);
    axios
      .get(`https://maestrodeljuego.herokuapp.com/gamenight/${gameId}`)
      .then((result: any) => {
        console.log(result.data);
        setGuestList(result.data.invitees);
        setGameNightPk(result.data.pk);
        console.log(result.data.options);
        setGameList(result.data.options);
        setEventStatus(result.data.status);
        setFinalGames(result.data.games);
        setGameNightDate(result.data.date);
        setGameNightLoc(result.data.location);
        setGameNightTime(result.data.start_time);
        setHost(result.data.user.username);
        setGuest(
          result.data.invitees[0].first_name +
            ' ' +
            result.data.invitees[0].last_name
        );
        setVoter(result.data.invitees[0].pk);
        for (let i = 0; i < result.data.options.length; i++) {
          setVotes((oldData) => [
            ...oldData,
            {
              game: result.data.options[i].pk,
              vote: 0,
            },
          ]);
        }
      })
      .catch((error: any) => console.log(error));
  }, []);

  useEffect(() => {
    for (let individual of guestList) {
      if (individual.first_name + ' ' + individual.last_name === guest) {
        setVoter(individual.pk);
      }
    }
  }, [guest]);

  const rsvpHandler = (event: any) => {
    event.preventDefault();
    let rsvpFirstName = '';
    let rsvpLastName = '';
    for (let individual of guestList) {
      if (individual.pk === voter) {
        rsvpFirstName = individual.first_name;
        rsvpLastName = individual.last_name;
      }
    }
    let rsvpSubmission = {
      invitee: {
        first_name: rsvpFirstName,
        last_name: rsvpLastName,
        email: inviteeEmail,
      },
      attending: attending,
    };
    console.log(rsvpSubmission);
    axios
      .post(
        `https://maestrodeljuego.herokuapp.com/gamenight/${gameId}/RSVP/`,
        rsvpSubmission,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log(response);
        setGuestPick(!guestPick);
      })
      .catch((error) => {
        console.log(error);
        setEmailError(
          'The email you entered did not match the record we have for this guest.'
        );
      });
  };

  const voteHandler = (gamePk: number, voteScore: number) => {
    let newVotes = [...votes];
    for (let gameId of newVotes) {
      if (gameId.game === gamePk) {
        gameId.vote = voteScore;
      }
      setVotes(newVotes);
    }
  };

  const voteSubmit = (event: any) => {
    event.preventDefault();
    let voteSubmission = [...votes];
    for (let voteObj of voteSubmission) {
      voteObj.gamenight = gameNightPk;
      voteObj.invitee = voter;
    }
    console.log(voteSubmission);
    axios
      .post(
        `https://maestrodeljuego.herokuapp.com/gamenight/${gameId}/voting/`,
        voteSubmission,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((response) => {
        console.log(response);
        setVoted(true);
      })
      .catch((error) => console.log(error));
  };

  return eventStatus === 'Cancelled' ? (
    <h1 className="gamenight-banner">
      I'm sorry, your host has cancelled this event!
    </h1>
  ) : eventStatus === 'Finalized' ? (
    <div id="finalized-event">
      <h1 className="gamenight-banner">Your game night is all set!</h1>
      <h3>Here are the games you'll be playing:</h3>
      <div id="final-game-container">
        {finalGames.map((game: any, i: any) => {
          return (
            <div style={{ margin: '20px' }}>
              <GameCard
                gameId={game.bgg}
                gameName={game.title}
                pubYear={game.pub_year}
                imageUrl={game.image}
                minPlayers={game.min_players}
                maxPlayers={game.max_players}
                playtime={game.playtime}
                categories={game.categories}
              />
            </div>
          );
        })}
      </div>
      <h2>
        This game night will take place on{' '}
        {dateFormat(gameNightDate, 'dddd, mmmm dS, yyyy')} at{' '}
        {convertTime(gameNightTime)} at {gameNightLoc}.
      </h2>
    </div>
  ) : voted ? (
    <div className="gamenight-banner">
      <h1>Thank you for feedback!</h1>
      <h4>Your host will contact you when the event is finalized.</h4>
    </div>
  ) : guestPick ? (
    <div id="guest-list-select">
      <form onSubmit={rsvpHandler} id="guest-list-form">
        <h1>You have been invited to {host}'s Game Knight!</h1>
        <h3>Select your name from below and provide an RSVP.</h3>
        <div id="guest-select">
          <Select
            title="Guest List Dropdown"
            name="guests"
            id="guest-list-dropdown"
            value={guest}
            sx={{ backgroundColor:"white" }}
            onChange={(event) => {
              setGuest(event.target.value);
            }}
          >
            {guestList.map((name: any, i: any) => {
              return (
                <MenuItem
                  value={name.first_name + ' ' + name.last_name}
                  key={i}
                >
                  {name.first_name + ' ' + name.last_name}
                </MenuItem>
              );
            })}
          </Select>
        </div>
        <div id="email-confirm">
          <p>{emailError}</p>
          <label htmlFor="invitee-email">
            <h3>Please confirm your email:</h3>
          </label>
          <TextField
            id="invitee-email"
            type="text"
            fullWidth
            value={inviteeEmail}
            sx={{ backgroundColor:"white" }}
            onChange={(event) => setInviteeEmail(event.target.value)}
          ></TextField>
        </div>
        <div id="rsvp-form">
          <h3>Will you be attending?</h3>
          <div id="rsvp-buttons">
            {attending === 'True' ? (
              <Button sx={{ backgroundColor:"#334195" }} variant="contained" onClick={() => setAttending('')}>
                Yes
              </Button>
            ) : (
              <Button sx={{ backgroundColor:"white", borderColor:"#334195", color:"#334195" }} variant="outlined" onClick={() => setAttending('True')}>
                Yes
              </Button>
            )}
            {attending === 'False' ? (
              <Button sx={{ backgroundColor:"#334195" }} variant="contained" onClick={() => setAttending('')}>
                No
              </Button>
            ) : (
              <Button sx={{ backgroundColor:"white", borderColor:"#334195", color:"#334195" }} variant="outlined" onClick={() => setAttending('False')}>
                No
              </Button>
            )}
          </div>
        </div>
        <Button sx={{ backgroundColor:"#334195" }} variant="contained" type="submit" id="guest-list-button">
          Submit
        </Button>
      </form>
    </div>
  ) : attending === 'True' ? (
    <div id="guest-vote-form">
      <div id="vote-form-header">
        <h1 className="vote-header">Welcome to Game Night!</h1>
        <h2>
          Use the smileys below to indicate your level of interest in the games
          your host has selected.
        </h2>
      </div>
      <div id="vote-card-container">
        {gameList.map((game: any, i: any) => {
          return (
            <VoteCard
              title={game.title}
              url={game.image}
              key={game.pk}
              voteHandler={voteHandler}
              pk={game.pk}
            />
          );
        })}
      </div>
      <div id="vote-form-buttons">
        <form id="vote-submission-form" onSubmit={voteSubmit}>
          <Button sx={{ backgroundColor:"#334195", marginRight:4, marginTop:4 }} variant="contained" type="submit" id="vote-submit">
            Vote
          </Button>
        </form>
        <Button sx={{ backgroundColor:"#334195", marginTop:4 }} variant="contained" onClick={() => setGuestPick(!guestPick)}>
          Back
        </Button>
      </div>
    </div>
  ) : (
    <div>
      <h2 className="gamenight-banner">
        Sorry you couldn't make it this time!
      </h2>
      <h3 className="gamenight-banner">We'll have to play again soon!</h3>
    </div>
  );
}
