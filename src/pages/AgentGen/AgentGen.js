import { useState, useEffect } from "react";
import apiCalls from "../../services/services";
import randomize from "../../services/randomizer";
import Auth from "../../services/auth";
import "./AgentGen.css";

function AgentGen() {
  const [isLoading, setLoading] = useState(true);
  const [agentArr, setAgentArr] = useState([]);
  const [checked, setChecked] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    apiCalls.getAllAgents().then((response) => {
      setAgentArr(response.data);
      setChecked(new Array(response.data.length).fill(true));
      const storedAgentState = localStorage.getItem("agentState");
      if (storedAgentState) {
        setChecked(JSON.parse(storedAgentState));
      }
      setLoading(false);
    });
  }, []);

  const handleHeaderClick = (event) => {
    const buttonClicked = event.target.id;
    if (buttonClicked === "agent") {
      window.location.href = `/`;
    } else {
      window.location.href = `/${buttonClicked}`;
    }
  };

  const handleCheckClick = (position) => {
    const updatedCheckedState = checked.map((item, index) =>
      index === position ? !item : item
    );
    localStorage.setItem("agentState", JSON.stringify(updatedCheckedState));
    setChecked(updatedCheckedState);
  };
  const formHandler = async (event) => {
    event.preventDefault();
    const selectedAgents = agentArr.filter((agent, index) => {
      return checked[index];
    });
    const generatedAgent = randomize(selectedAgents);
    const agentBlock = (
      <div id="generatedAgentContainer">
        <h2>{generatedAgent.displayName}</h2>
        <h4>
          <i>{generatedAgent.role.displayName}</i>
        </h4>
        <img
          id="generatedAgentPortrait"
          alt="portrait of agent"
          src={generatedAgent.bustPortrait}
        />
        <a id="moreInfo-link" href={`/moreInfo?agent=${generatedAgent.uuid}`}>
          More about {generatedAgent.displayName}
        </a>
      </div>
    );
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile();
      const response = await apiCalls.updateUserHistory(
        { agentId: generatedAgent.uuid },
        userData._id,
        "agent",
        Auth.getToken()
      );
      console.log(response);
    }
    setResult(agentBlock);
    document.getElementById("resultContainer").classList.remove("hidden");
    document.getElementById("agentSelectForm").classList.add("hidden");
    document
      .getElementById("extraFunctionButton-container")
      .classList.add("hidden");
  };

  const changeSettings = (event) => {
    event.preventDefault();
    document.getElementById("resultContainer").classList.add("hidden");
    document.getElementById("agentSelectForm").classList.remove("hidden");
    document
      .getElementById("extraFunctionButton-container")
      .classList.remove("hidden");
  };

  const changeAllHandler = (boolean) => {
    setChecked(checked.map(() => boolean));
    localStorage.setItem(
      "agentState",
      JSON.stringify(checked.map(() => boolean))
    );
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  let agentSelect = [];

  for (let i = 0; i < agentArr.length; i++) {
    const block = (
      <div
        id={agentArr[i].uuid}
        className="agentSelectThumbnailContainer"
        key={agentArr[i].displayName}
      >
        <img
          id={agentArr[i].displayName}
          className={`agentSelectThumbnail caret-hidden ${
            checked[i] ? "active" : "inactive"
          }`}
          alt={`Portrait of ${agentArr[i].displayName}`}
          src={agentArr[i].displayIcon}
        />
        <input
          id={i}
          type="checkbox"
          className="agentSelect-checkbox"
          onChange={() => {
            handleCheckClick(i);
          }}
          checked={checked[i]}
        />
      </div>
    );
    agentSelect.push(block);
  }

  return (
    <div id="agentGenContainer">
      <section>
        <button
          id="agent"
          className="header-button"
          onClick={handleHeaderClick}
        >
          Random Agent
        </button>
        <button
          id="weapon"
          className="header-button inactive-header"
          onClick={handleHeaderClick}
        >
          Random Weapon
        </button>
        <button
          id="strategy"
          className="header-button inactive-header"
          onClick={handleHeaderClick}
        >
          Random Strategy
        </button>
      </section>
      <div id="resultContainer" className="hidden">
        {result}
        <button
          id="generateAgain-button"
          className="button"
          onClick={formHandler}
        >
          Generate again
        </button>
        <button
          id="changeSettings-button"
          className="button"
          onClick={changeSettings}
        >
          Change Settings
        </button>
      </div>
      <form id="agentSelectForm" onSubmit={formHandler}>
        <div
          id="agentSelectContainer"
          onClick={(e) => {
            if (e.target.nextSibling) {
              if (e.target.id === "agentSelectContainer") {
                return;
              }
              const i = e.target.nextSibling.id;
              const newState = [...checked];
              newState.splice(i, 1, !checked[i]);
              localStorage.setItem("agentState", JSON.stringify(newState));
              setChecked(newState);
            }
          }}
        >
          {agentSelect}
        </div>
        <button
          type="submit"
          id="agentSelect-submitBtn"
          disabled={checked.every((element) => element === false)}
          className="button"
        >
          Generate
        </button>
      </form>
      <div id="extraFunctionButton-container">
        <button
          className="button"
          onClick={() => {
            changeAllHandler(true);
          }}
        >
          Select All
        </button>
        <button
          className="button"
          onClick={() => {
            changeAllHandler(false);
          }}
        >
          Unselect All
        </button>
      </div>
    </div>
  );
}

export default AgentGen;
