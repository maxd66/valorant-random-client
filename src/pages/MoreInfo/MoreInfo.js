import "./MoreInfo.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import apiCalls from "../../services/services";
import valorantV from "../../assets/images/valorant-v.png";
function MoreInfo() {
  const [isLoading, setLoading] = useState(true);
  const [apiResults, setApiResults] = useState({});

  const queryString = useLocation().search;
  const agent = new URLSearchParams(queryString).get("agent");
  const weapon = new URLSearchParams(queryString).get("weapon");
  useEffect(() => {
    if (agent) {
      //run api search for agent, populate apiResults
      apiCalls.getOneAgent(agent).then((res) => {
        if (res === "agent not found") {
          setApiResults({
            notFound:
              "These are not the agents you are looking for. Sorry we couldn't find that agent",
          });
        } else {
          setApiResults(res.data);
        }
        setLoading(false);
      });
    } else if (weapon) {
      //rrun api search for weapon and populate apiResults
      apiCalls.getOneWeapon(weapon).then((res) => {
        if (res === "weapon not found") {
          setApiResults({
            notFound:
              "These are not the weapons you are looking for. Sorry we couldn't find that weapon",
          });
        } else {
          setApiResults(res.data);
        }
        setLoading(false);
      });
    } else {
      //search not defined, populate apiResults with error
      setApiResults({ notFound: "Sorry, no search parameter received." });
      setLoading(false);
    }
  }, []);
  //get query string from url, determine whether agent or weapon, run apiCall
  //for single agent or single weapon. Return block of code for agent or weapon
  //to be rendered
  //Only dynamic elements will be same header buttons from home page, maybe
  //That's actually it, and I think I'm visioning the page without the home buttons
  //especially if there is a home link in the nav bar attached to logo

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  let rangeBlock = [];

  if (apiResults.weaponStats?.damageRanges[0]) {
    apiResults.weaponStats.damageRanges.forEach((el) => {
      rangeBlock.push(
        <fieldset key={el.headDamage}>
          <legend>
            {el.rangeStartMeters +
              " - " +
              el.rangeEndMeters +
              " m Range Damage "}
          </legend>
          <h3>Head: {el.headDamage}</h3>
          <h3>Body: {el.bodyDamage}</h3>
          <h3>Leg: {el.legDamage}</h3>
        </fieldset>
      );
    });
  }

  return (
    <div
      style={{
        backgroundImage: `url(${
          apiResults?.background || apiResults.fullPortraitV2 || valorantV
        })`,
        backgroundPosition: "center",
        backgroundSize: `25%`,
        minHeight: "100vh",
      }}
    >
      <div id="result-container">
        {agent ? (
          <div id="agentResultContainer">
            <div className="flex-container">
              <div className="left">
                <h1>{apiResults?.displayName}</h1>
                <p>{apiResults?.description}</p>
                <img
                  alt={`display icon for ${apiResults?.displayName}`}
                  src={apiResults?.fullPortraitV2}
                  id="agent-portrait"
                />
              </div>
              <div className="right">
                <h1>
                  {apiResults?.role?.displayName + " "}
                  <span>
                    <img
                      alt="role icon"
                      src={apiResults?.role?.displayIcon}
                      id="role-DisplayIcon"
                    />
                  </span>
                </h1>
                <p>{apiResults?.role?.description}</p>
                <fieldset id="ability1" className="abilityContainer">
                  <legend>
                    <img
                      alt="ability 1 icon"
                      src={
                        apiResults?.abilities
                          ? apiResults.abilities[0].displayIcon
                          : null
                      }
                      className="ability-icon"
                    />
                  </legend>
                  <h3>
                    {apiResults?.abilities
                      ? apiResults?.abilities[0].displayName
                      : null}
                  </h3>
                  <p>
                    {apiResults?.abilities
                      ? apiResults?.abilities[0].description
                      : null}
                  </p>
                </fieldset>
                <fieldset id="ability2" className="abilityContainer">
                  <legend>
                    <img
                      alt="ability 2 icon"
                      src={
                        apiResults?.abilities
                          ? apiResults?.abilities[1].displayIcon
                          : null
                      }
                      className="ability-icon"
                    />
                  </legend>
                  <h3>
                    {apiResults?.abilities
                      ? apiResults?.abilities[1].displayName
                      : null}
                  </h3>
                  <p>
                    {apiResults?.abilities
                      ? apiResults?.abilities[1].description
                      : null}
                  </p>
                </fieldset>
                <fieldset id="ability3" className="abilityContainer">
                  <legend>
                    <img
                      alt="ability 3 icon"
                      src={
                        apiResults?.abilities
                          ? apiResults?.abilities[2].displayIcon
                          : null
                      }
                      className="ability-icon"
                    />
                  </legend>
                  <h3>
                    {apiResults?.abilities
                      ? apiResults?.abilities[2].displayName
                      : null}
                  </h3>
                  <p>
                    {apiResults?.abilities
                      ? apiResults?.abilities[2].description
                      : null}
                  </p>
                </fieldset>
                <fieldset
                  id="ability4"
                  className="abilityContainer ultimate-container"
                >
                  <legend>
                    <img
                      alt="ability 4 icon"
                      src={
                        apiResults?.abilities
                          ? apiResults?.abilities[3].displayIcon
                          : null
                      }
                      className="ability-icon"
                    />
                  </legend>
                  <h3>
                    {apiResults?.abilities
                      ? apiResults?.abilities[3].displayName
                      : null}
                  </h3>
                  <p>
                    {apiResults?.abilities
                      ? apiResults?.abilities[3].description
                      : null}
                  </p>
                </fieldset>
              </div>
            </div>
          </div>
        ) : (
          <div id="weaponResultContainer">
            <h1>{apiResults?.displayName}</h1>
            <img
              id="weaponDisplayIcon"
              alt="weapon display icon"
              src={apiResults?.displayIcon}
            />
            <h2>Category: {apiResults?.category?.split("::")[1]}</h2>
            <h2>
              <i>
                Cost: {apiResults?.shopData ? apiResults.shopData.cost : null}
              </i>
            </h2>
            <div id="stat-container" className="flex-container">
              {/* <div id="column1" className="stat-column"> */}
              <fieldset>
                <legend>Fire Rate</legend>
                <h3>
                  {apiResults?.weaponStats
                    ? apiResults.weaponStats.fireRate
                    : "N/A"}{" "}
                  rps
                </h3>
              </fieldset>
              <fieldset>
                <legend>Magazine Size</legend>
                <h3>
                  {apiResults?.weaponStats
                    ? apiResults.weaponStats.magazineSize
                    : "N/A"}
                </h3>
              </fieldset>
              <fieldset>
                <legend>Reload Time</legend>
                <h3>
                  {apiResults?.weaponStats
                    ? apiResults.weaponStats.reloadTimeSeconds + " sec"
                    : "N/A"}
                </h3>
              </fieldset>
              <fieldset>
                <legend>Equip Time</legend>
                <h3>
                  {apiResults?.weaponStats
                    ? apiResults.weaponStats.equipTimeSeconds
                    : "N/A"}{" "}
                  sec
                </h3>
              </fieldset>
              <fieldset>
                <legend>Run Speed Multiplier</legend>
                <h3>
                  {apiResults?.weaponStats
                    ? apiResults.weaponStats.runSpeedMultiplier
                    : "N/A"}
                </h3>
              </fieldset>
              <fieldset>
                <legend>Zoom Multiplier</legend>
                <h3>
                  {apiResults?.weaponStats.adsStats
                    ? apiResults.weaponStats.adsStats?.zoomMultiplier + " x"
                    : "N/A"}
                </h3>
              </fieldset>
              {rangeBlock}
            </div>
          </div>
        )}
      </div>
      <button
        id="moreInfo-backButton"
        onClick={(e) => {
          e.preventDefault();
          if (weapon) {
            window.location.href = "/weapon";
          } else {
            window.location.href = "/";
          }
        }}
      >
        Back to generating
      </button>
    </div>
  );
}

export default MoreInfo;
