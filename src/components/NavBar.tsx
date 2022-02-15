//Imports include links to different views throughout our site, the Game Knight logo, and Material UI components.
import { Link } from 'react-router-dom';
import logo from '../assets/bw-logo.png';
import { Divider, Box } from '@mui/material';

//Props for the component: a username (string), a logout function, a user avatar (URL, so string), and the auth key sent from
//the Game Knight back end (string).
interface navProps {
  user: string;
  logout: any;
  avatar: string;
  auth: string;
}

export default function NavBar(props: navProps) {
  return (
    <>
      <div id="nav-bar">
        <div id="game-knight">
          <Link
            to={props.auth === '' ? '/' : `/play_stats/${props.user}`}
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
          >
            <img
              src={logo}
              id="logo"
              title="Game Master"
              alt="Game Master Logo"
            />
          </Link>
          <span id="game-knight-banner">Game Knight</span>
        </div>
        <Box id="site-nav" sx={{ display: 'flex' }}>
          {props.user !== '' ? (
            <Link to={`/play_stats/${props.user}`}>Playstats Homepage</Link>
          ) : (
            <Link to={`/login/`}>Playstats Homepage</Link>
          )}
          <Divider
            sx={{ background: 'white', marginLeft: 1, marginRight: 1 }}
            orientation="vertical"
            flexItem
          />
          <Link to={`/collection/${props.user}`}>Your Collection</Link>
          <Divider
            sx={{ background: 'white', marginLeft: 1, marginRight: 1 }}
            orientation="vertical"
            flexItem
          />
          <Link to="/search">Add Games</Link>
          <Divider
            sx={{ background: 'white', marginLeft: 1, marginRight: 1 }}
            orientation="vertical"
            flexItem
          />
          {props.user !== '' ? (
            <Link to={`/game_night/`}>Game Knight Dashboard</Link>
          ) : (
            <Link to={`/login/`}>Game Knight Dashboard</Link>
          )}
        </Box>
        <div id="account-links">
          {props.user === '' ? (
            <Box id="login-nav" sx={{ display: 'flex' }}>
              <Link to="/login">Login</Link>
              <Divider
                sx={{ background: 'white', marginLeft: 1, marginRight: 1 }}
                orientation="vertical"
                flexItem
              />
              <Link to="/registration">Register</Link>
            </Box>
          ) : (
            <div id="navbar-avatar">
              <Link to={`/user_page/${props.user}`}>
                <img
                  alt="User Avatar"
                  src={
                    props.avatar === '' || props.avatar === null
                      ? 'https://thumbs.dreamstime.com/b/vector-illustration-isolated-white-background-user-profile-avatar-black-line-icon-user-profile-avatar-black-solid-icon-121102166.jpg'
                      : props.avatar
                  }
                  title="User Avatar"
                  id="avatar"
                />
              </Link>
              <span
                style={{
                  color: 'white',
                  fontSize: 15,
                  textAlign: 'center',
                }}
              >
                {props.user}
              </span>
              <Link to="/" onClick={props.logout} id="log-out">
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
      <hr id="hr-1" />
    </>
  );
}
