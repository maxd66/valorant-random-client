import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Auth from "./services/auth";
import Nav from "./components/Nav/Nav";
import AgentGen from "./pages/AgentGen/AgentGen";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Profile from "./pages/Profile/Profile";
import WeaponGen from "./pages/WeaponGen/WeaponGen";
import StrategyGen from "./pages/StrategyGen/StrategyGen";
import MoreInfo from "./pages/MoreInfo/MoreInfo";
import logo from "./assets/images/valoRandom-logo.png";
import agentBackground from "./assets/images/simple.jpg";

function App() {
  const loggedIn = Auth.loggedIn();

  const handleNavProfileClick = (e) => {
    e.preventDefault();
    const stillLoggedIn = Auth.loggedIn();
    if (stillLoggedIn) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/signIn";
    }
  };
  return (
    <div
      id="outer-container"
      style={{
        backgroundImage: `url(${agentBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Nav />
      <main id="page-wrap" className="App">
        <Router>
          <div className="header-attempt" style={{ zIndex: "10" }}>
            <a id="valorandom-logo" href="/">
              <img className="App-logo" alt="valorandom logo" src={logo} />
            </a>
            {loggedIn ? (
              <button
                id="profileButton"
                className="nav-button"
                onClick={handleNavProfileClick}
              >
                My Profile
              </button>
            ) : (
              <a href="/signIn">
                <button id="signInButton" className="nav-button">
                  Sign in
                </button>
              </a>
            )}
          </div>
          <div className="padding-div">_</div>
          <Route exact path="/">
            <AgentGen />
          </Route>
          <Route exact path="/weapon">
            <WeaponGen />
          </Route>
          <Route exact path="/strategy">
            <StrategyGen />
          </Route>
          <Route exact path="/signIn">
            <SignIn />
          </Route>
          <Route exact path="/signUp">
            <SignUp />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/moreInfo">
            <MoreInfo />
          </Route>
        </Router>
      </main>
    </div>
  );
}

export default App;
