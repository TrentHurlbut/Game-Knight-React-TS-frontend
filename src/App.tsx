//Packages that take care of navigation, API requests, and state storage.
import './App.css';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import useLocalStorageState from 'use-local-storage-state';

//Components used throughout the site.
import Login from './routes/Login';
import Registration from './routes/Registration';
import AccountSettings from './routes/AccountSettings';
import Home from './routes/Home';
import Search from './routes/Search';
import GameInfoPage from './routes/GameInfoPage';
import PlayStats from './routes/PlayStats';
import CreateEvent from './routes/CreateEvent';
import VotingForm from './routes/VotingForm';
import CollectionPage from './routes/CollectionPage';
import GameNightMenu from './routes/GameNightMenu';
import GameNightOwnerView from './routes/GameNightOwnerView';
import FeedbackForm from './routes/FeedbackForm';

function App() {
  //At the top level, this app keeps in local storage the name of the currently logged in user, their auth token, and the image URL
  //associtated with their account. This is to populate the navbar and to send these pieces of information along when making
  //requests to the back end.
  const [user, setUser] = useLocalStorageState('gameMasterUser', '');
  const [token, setToken] = useLocalStorageState('gameMasterToken', '');
  const [avatar, setAvatar] = useLocalStorageState('gameMasterAvatar', '');

  //This function sets the user and token states at login or registration. Sometimes a user does not have an avatar associated with
  //their account, so that is handled in a separate function below.
  function setAuth(username: string, token: string) {
    setUser(username);
    setToken(token);
  }

  //This function is used when a user changes their avatar in the account settings page.
  const updateAvatar = (newImg: string) => setAvatar(newImg);

  //This function is used when a user changes their username in the user settings page.
  const updateUser = (newUser: string) => setUser(newUser);

  //The logoutHandler logs a user out and clears all information from local storage.
  const logoutHandler = () => {
    axios
      .post(
        'https://maestrodeljuego.herokuapp.com/auth/token/logout/',
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        //User and avatar are cleared individually in order for the information passed to the navbar to update.
        setUser('');
        setAvatar('');
        localStorage.clear();
      })
      .catch((error) => alert(error));
  };

  return (
    //So begin our routes throughout the site!
    <Router>
      {/* The navbar is always visible. */}
      <NavBar user={user} logout={logoutHandler} avatar={avatar} auth={token} />

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={<Login setAuth={setAuth} updateAvatar={updateAvatar} />}
        />
        {/* Registration */}
        <Route
          path="/registration"
          element={
            <Registration setAuth={setAuth} updateAvatar={updateAvatar} />
          }
        />
        {/* Homepage where logged out or unregistered users land. */}
        <Route path="/" element={<Home />} />
        {/* Account Settings */}
        <Route
          path="/user_page/:user"
          element={
            <AccountSettings
              user={user}
              avatar={avatar}
              authToken={token}
              updateAvatar={updateAvatar}
              updateUser={updateUser}
            />
          }
        />
        {/* Add Games */}
        <Route path="/search" element={<Search token={token} user={user} />} />
        {/* Zoomed-in information for each game in a user's collection. */}
        <Route
          path="games/:gameId"
          element={<GameInfoPage token={token} user={user} />}
        />
        {/* A user's playstsats page where information on board game playrate and game knight success are visible after
        a user has hosted and receieved feedback on a certain ammount of knights. */}
        <Route
          path="play_stats/:user"
          element={<PlayStats user={user} token={token} />}
        />
        {/* The Create Event page. */}
        <Route
          path="/createevent"
          element={<CreateEvent user={user} token={token} />}
        />
        {/* The form which invitees are able to access to vote on which games they would like to play at their game knight. */}
        <Route
          path="/game_night/:gameId"
          element={<VotingForm token={token} />}
        />
        {/* The form with which attendees of a game knight provide feedback to their host. */}
        <Route path="/game_night/:gameId/feedback" element={<FeedbackForm />} />
        {/* The page that shows all a user's currently active and past game knights. Name deprecated. */}
        <Route
          path="/game_night/"
          element={<GameNightMenu user={user} token={token} />}
        />
        {/* Once a game knight is finalized, a user can see its associated details in the owner view. */}
        <Route
          path="/game_night/:gameNightId/finalize"
          element={<GameNightOwnerView token={token} />}
        />
        {/* A user's collection page. */}
        <Route
          path="/collection/:user"
          element={<CollectionPage user={user} token={token} />}
        />
        {/* Routes an unlogged in user to the login screen if they click "Your Collection" link. */}
        <Route 
          path="/collection/"
          element={<Login setAuth={setAuth} updateAvatar={updateAvatar} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
