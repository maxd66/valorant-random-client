import "./Nav.css";
import { slide as Menu } from "react-burger-menu";
import Auth from "../../services/auth";

function Nav() {
  const styles = {
    bmItemList: {
      height: "90%",
    },
  };
  const loggedIn = Auth.loggedIn();

  const signOut = () => {
    Auth.logout();
  };
  return (
    <Menu
      right
      styles={styles}
      pageWrapId="page-wrap"
      outerContainerId="outer-container"
    >
      <a id="homeNavLink" className="menu-item" href="/">
        Agents
      </a>
      <a id="weaponNav" className="menu-item" href="/weapon">
        Weapons
      </a>
      <a id="homeNavLink" className="menu-item" href="/strategy">
        Strategies
      </a>
      <hr className="solid" />
      {loggedIn ? (
        <a id="profileNavLink" className="menu-item" href="/profile">
          My Profile
        </a>
      ) : (
        <a id="signInNavLink" className="menu-item" href="/signIn">
          Sign in
        </a>
      )}
      {loggedIn ? (
        <a id="signOutNavLink" className="menu-item" href="/" onClick={signOut}>
          Sign out
        </a>
      ) : (
        <a id="signUpNavLink" className="menu-item" href="/signUp">
          Create an account
        </a>
      )}
    </Menu>
  );
}
export default Nav;
