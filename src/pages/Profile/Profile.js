import "./Profile.css";
import React, { useEffect, useState } from "react";
import Auth from "../../services/auth";
import apiCalls from "../../services/services";

function Profile() {
  const stillLoggedIn = Auth.loggedIn();
  if (!stillLoggedIn) {
    window.location.href = "/signIn";
  }
  const [isLoading, setLoading] = useState(true);
  const [userData, setUserData] = useState("");
  const [agentData, setAgentData] = useState("");
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    username: "",
    riotUsername: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleAgentClick = (event) => {
    const agentSelected = event.target.id;
    window.location.href = `/moreInfo?agent=${agentSelected}`;
  };

  function validatePassword(password) {
    if (password < 7 || password > 64) {
      return false;
    } else {
      return true;
    }
  }

  async function checkTakenUsername(username) {
    if (username < 6 || username > 24) {
      return true;
    }
    const usernameTaken = await apiCalls.checkUsername(username);
    return usernameTaken;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    let usernameTaken = false;
    let validPassword = true;
    if (formState.password) {
      validPassword = validatePassword(formState.password);
    }
    if (formState.username) {
      usernameTaken = await checkTakenUsername(formState.username);
    }
    if (!usernameTaken && validPassword) {
      const userInfo = { ...formState };
      for (const [key, value] of Object.entries(userInfo)) {
        if (!value) {
          delete userInfo[key];
        }
      }
      const updateResult = await apiCalls.updateUser(
        userInfo,
        userData._id,
        Auth.getToken()
      );
      if (updateResult.token) {
        window.location.reload();
      }
    } else {
      // add different way to alert the user, maybe a tool tip
      alert("Sorry! This username is taken");
      //make input box red
      document.getElementById("username").classList.add("warning");
    }
  }

  useEffect(() => {
    const userId = Auth.getProfile()._id;
    apiCalls
      .getSingleUser(userId, Auth.getToken())
      .then((response) => {
        setUserData(response);
        return apiCalls.getAllAgents();
      })
      .then((response) => {
        setAgentData(response.data);
        setLoading(false);
      });
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  let agentBlock = [];
  const agentArr = userData.userHistory.lastTenAgents;
  for (let i = 0; i < agentArr.length; i++) {
    //make call to valorant api, generate agent based on user history
    const thisAgent = agentData.filter((agent) => {
      return agent.uuid === agentArr[i];
    });
    const block = (
      <div className="agentThumbnailContainer" key={i}>
        <img
          id={thisAgent[0].uuid}
          className="agentThumbnail"
          alt={`Portrait of ${thisAgent[0].displayName}`}
          src={thisAgent[0].displayIcon}
          onClick={handleAgentClick}
        />
        <h3 className="caret-hidden">{`${thisAgent[0].displayName}`}</h3>
        <img
          className="ult-symbol"
          alt="ult symbol for this agent"
          src={thisAgent[0].abilities[3].displayIcon}
        />
      </div>
    );
    agentBlock.push(block);
  }
  return (
    <div id="profilePageContainer">
      <h1 id="welcome-header">Hey {userData?.username}, welcome back!</h1>
      <section id="main-container">
        <form id="updateForm-container" onSubmit={handleFormSubmit}>
          <div className="updateInput">
            <label htmlFor="email">Update Email: </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder={userData.email}
            />
          </div>
          <div className="updateInput">
            <label htmlFor="username">Update Username: </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formState.username}
              onChange={handleChange}
              placeholder={userData.username}
            />
          </div>
          <div className="updateInput">
            <label htmlFor="password">Update Password: </label>
            <input
              type="text"
              id="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
            />
          </div>
          <div className="updateInput">
            <label htmlFor="riotUsername">Update Riot Username: </label>
            <input
              type="text"
              id="riotUsername"
              name="riotUsername"
              value={formState.riotUsername}
              onChange={handleChange}
              placeholder={userData.riotUsername}
            />
          </div>
          <button type="submit" id="updateForm-button">
            Save changes
          </button>
        </form>
        <div id="genStats-container">
          <fieldset id="agentsGenerated">
            <legend className="legend">Agents Generated</legend>
            <h2>{userData.userHistory.agentsGenerated}</h2>
          </fieldset>
          <fieldset id="weaponsGenerated">
            <legend className="legend">Weapons Generated</legend>
            <h2>{userData.userHistory.weaponsGenerated}</h2>
          </fieldset>
          <fieldset id="strategiesGenerated">
            <legend className="legend">Strategies Generated</legend>
            <h2>{userData.userHistory.strategiesGenerated}</h2>
          </fieldset>
        </div>
      </section>
      <h2>Last agents generated</h2>
      <b>
        <i>Click for more info</i>
      </b>
      <div id="agentListContainer">
        {agentBlock.length ? (
          agentBlock
        ) : (
          <h3>
            None yet, <a href="/">get generating.</a>
          </h3>
        )}
      </div>
    </div>
  );
}

export default Profile;
