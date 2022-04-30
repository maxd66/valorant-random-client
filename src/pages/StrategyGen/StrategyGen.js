import "./StrategyGen.css";
import { useEffect, useState } from "react";
import apiCalls from "../../services/services";
import randomize from "../../services/randomizer";
import Auth from "../../services/auth";

function StrategyGen() {
  const [filterState, setFilterState] = useState({
    tactical: false,
    funny: false,
    attack: false,
    defend: false,
    playerSlider: 1,
    savedPlayerValue: 1,
  });
  const [validFilter, setValidFilter] = useState(false);
  const [filteredApiResult, setFilteredApiResult] = useState(
    JSON.parse(localStorage.getItem("filteredStrategies")) || []
  );
  const [result, setResult] = useState([]);
  const [wolStats, setWolStats] = useState([]);
  const [stratLoading, setStratLoading] = useState(false);

  useEffect(() => {
    const localSettings = localStorage.getItem("strategyState");
    if (localSettings) {
      setFilterState(JSON.parse(localSettings));
    }
  }, []);

  const handleHeaderClick = (event) => {
    const buttonClicked = event.target.id;
    if (buttonClicked === "agent") {
      window.location.href = `/`;
    } else {
      window.location.href = `/${buttonClicked}`;
    }
  };

  const filterHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (name === "playerSlider") {
      setFilterState({
        ...filterState,
        [name]: value,
        savedPlayerValue: value,
      });
    } else if (name === "tactical") {
      const currentValue = filterState[name];
      if (!currentValue) {
        setFilterState({
          ...filterState,
          [name]: !currentValue,
          playerSlider: 5,
        });
      } else {
        const previousValue = filterState.savedPlayerValue;
        setFilterState({
          ...filterState,
          [name]: !currentValue,
          playerSlider: previousValue,
        });
      }
    } else {
      const currentValue = filterState[name];
      setFilterState({
        ...filterState,
        [name]: !currentValue,
      });
    }
  };

  const checkValidFilter = () => {
    if (
      (filterState.tactical || filterState.funny) &&
      (filterState.attack || filterState.defend)
    ) {
      setValidFilter(true);
    } else {
      setValidFilter(false);
    }
  };

  const updateWolStats = (wins, losses) => {
    const statBlock = (
      <div>
        <h4>
          <i>Wins: </i>
          {wins}
        </h4>
        <h4>
          <i>Losses: </i>
          {losses}
        </h4>
      </div>
    );
    setWolStats(statBlock);
  };

  const strategyWolHandler = async (strategy, wol) => {
    const response = await apiCalls.addWinOrLoss(strategy._id, wol);
    const strategyIndex = filteredApiResult.indexOf(strategy);
    const filteredArray = [...filteredApiResult];
    if (wol === "wins") {
      const newWins = strategy.wins + 1;
      const newStrategyObj = { ...strategy, wins: newWins };
      filteredArray.splice(strategyIndex, 1, newStrategyObj);
      setFilteredApiResult(filteredArray);
    } else {
      const newLosses = strategy.losses + 1;
      const newStrategyObj = { ...strategy, losses: newLosses };
      filteredArray.splice(strategyIndex, 1, newStrategyObj);
      setFilteredApiResult(filteredArray);
    }
    localStorage.removeItem("allStrategies");
    localStorage.removeItem("strategyDate");
    document.getElementById("wolButtonContainer").classList.add("hidden");
    document.getElementById("wolMessageContainer").classList.remove("hidden");
    updateWolStats(response.response.wins, response.response.losses);
  };

  const genClickHandler = async (e) => {
    setStratLoading(true);
    e.preventDefault();
    let filterObj = {};
    let response;
    if (!filterState.tactical || !filterState.funny) {
      if (!filterState.tactical) {
        filterObj.class = "funny";
      } else {
        filterObj.class = "tactical";
      }
    }
    if (!filterState.attack || !filterState.defend) {
      if (!filterState.attack) {
        filterObj.side = "defend";
      } else {
        filterObj.side = "attack";
      }
    }
    if (filterObj.class || filterObj.side) {
      response = await apiCalls.getFilteredStrategies(filterObj);
    } else {
      response = await apiCalls.getAllStrategies();
    }
    const playerCountFilteredResponse = response.filter((strategy) => {
      return strategy.recommendedMinimumPlayers <= filterState.playerSlider;
    });
    localStorage.setItem(
      "filteredStrategies",
      JSON.stringify(playerCountFilteredResponse)
    );
    setFilteredApiResult(playerCountFilteredResponse);
    const randomStrategy = randomize(playerCountFilteredResponse);
    localStorage.setItem("strategyState", JSON.stringify(filterState));
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile();
      await apiCalls.updateUserHistory(
        { strategyId: randomStrategy._id },
        userData._id,
        "strategy",
        Auth.getToken()
      );
    }
    updateWolStats(randomStrategy.wins, randomStrategy.losses);
    const strategyBlock = (
      <div>
        <h2>{randomStrategy.title}</h2>
        <p className="big-p">{randomStrategy.description}</p>
        <p className="small-p">
          <i>Type: </i>
          {randomStrategy.class === "funny" ? "Funny" : "Tactical"}
        </p>
        <p className="small-p">
          <i>Side: </i>
          {randomStrategy.side === "na"
            ? "Attack or Defend"
            : randomStrategy.side === "attack"
            ? "Attack"
            : "Defend"}
        </p>
        <div id="wolButtonContainer">
          <button
            className="button"
            onClick={() => {
              strategyWolHandler(randomStrategy, "wins");
            }}
          >
            We won!
          </button>
          <button
            className="button"
            onClick={() => {
              strategyWolHandler(randomStrategy, "losses");
            }}
          >
            We lost...
          </button>
        </div>
        <div id="wolMessageContainer" className="hidden">
          <p>
            <i>Thanks for the contribution!</i>
          </p>
        </div>
      </div>
    );
    setResult(strategyBlock);
    setStratLoading(false);

    document.getElementById("resultContainer").classList.remove("hidden");
    document.getElementById("strategyFormContainer").classList.add("hidden");
  };

  const generateAgain = async (event) => {
    event.preventDefault();
    const randomStrategy = randomize(filteredApiResult);
    updateWolStats(randomStrategy.wins, randomStrategy.losses);
    document.getElementById("wolButtonContainer").classList.remove("hidden");
    document.getElementById("wolMessageContainer").classList.add("hidden");
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile();
      await apiCalls.updateUserHistory(
        { strategyId: randomStrategy._id },
        userData._id,
        "strategy",
        Auth.getToken()
      );
    }
    const strategyBlock = (
      <div>
        <h2>{randomStrategy.title}</h2>
        <p className="big-p">{randomStrategy.description}</p>
        <p className="small-p">
          <i>Type: </i>
          {randomStrategy.class === "funny" ? "Funny" : "Tactical"}
        </p>
        <p className="small-p">
          <i>Side: </i>
          {randomStrategy.side === "na"
            ? "Attack or Defend"
            : randomStrategy.side === "attack"
            ? "Attack"
            : "Defend"}
        </p>
        <div id="wolButtonContainer">
          <button
            className="button"
            onClick={() => {
              strategyWolHandler(randomStrategy, "wins");
            }}
          >
            We won!
          </button>
          <button
            className="button"
            onClick={() => {
              strategyWolHandler(randomStrategy, "losses");
            }}
          >
            We lost...
          </button>
        </div>
        <div id="wolMessageContainer" className="hidden">
          <p>
            <i>Thanks for the contribution!</i>
          </p>
        </div>
      </div>
    );
    setResult(strategyBlock);
  };

  const changeSettings = (event) => {
    event.preventDefault();
    document.getElementById("resultContainer").classList.add("hidden");
    document.getElementById("strategyFormContainer").classList.remove("hidden");
    document.getElementById("wolButtonContainer").classList.remove("hidden");
    document.getElementById("wolMessageContainer").classList.add("hidden");
  };

  useEffect(checkValidFilter, [filterState]);

  return (
    <div id="strategyPageContainer">
      <section>
        <button
          id="agent"
          className="header-button inactive-header"
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
          className="header-button"
          onClick={handleHeaderClick}
        >
          Random Strategy
        </button>
      </section>
      <div id="resultContainer" className="hidden">
        <div>{result}</div>
        <button onClick={generateAgain}>Generate again</button>
        <button onClick={changeSettings}>Change Settings</button>
        <div>{wolStats}</div>
      </div>
      <div id="strategyFormContainer">
        <h3 id="strategy-header-text">
          Please select at least one option from both of the following
        </h3>
        <div>
          <h3>Type of strategies included</h3>
          <button
            id="tactical-button"
            name="tactical"
            className={`button ${
              filterState.tactical ? "activeButton" : "inactiveButton"
            }`}
            onClick={filterHandler}
          >
            Tactical
          </button>
          <button
            id="funny-button"
            name="funny"
            className={`button ${
              filterState.funny ? "activeButton" : "inactiveButton"
            }`}
            onClick={filterHandler}
          >
            Funny
          </button>
        </div>
        <div>
          <h3>Roles included</h3>
          <button
            id="attack-button"
            name="attack"
            className={`button ${
              filterState.attack ? "activeButton" : "inactiveButton"
            }`}
            onClick={filterHandler}
          >
            Attack
          </button>
          <button
            id="defend-button"
            name="defend"
            className={`button ${
              filterState.defend ? "activeButton" : "inactiveButton"
            }`}
            onClick={filterHandler}
          >
            Defend
          </button>
        </div>
        <div>
          <h3 id="sliderHeader">Number of participating players</h3>
          <p>
            This is based on our recommended number of players for each
            strategy.{" "}
            <b>Tactical strategies assume you have five participants.</b>
          </p>
          <input
            id="playerSlider"
            min="1"
            max="5"
            name="playerSlider"
            value={filterState.tactical ? "5" : filterState.playerSlider}
            disabled={filterState.tactical}
            onChange={filterHandler}
            type="range"
          />
          <label id="slider-label" htmlFor="playerSlider">
            {filterState.playerSlider}
          </label>
        </div>
        <button
          disabled={!validFilter || stratLoading}
          id="strategyGenerate-button"
          className={`button ${
            validFilter ? "activeButton" : "inactiveButton"
          }`}
          onClick={genClickHandler}
        >
          {stratLoading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}

export default StrategyGen;
