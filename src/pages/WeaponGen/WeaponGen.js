import { useState, useEffect } from "react";
import apiCalls from "../../services/services";
import randomize from "../../services/randomizer";
import Auth from "../../services/auth";
import "./WeaponGen.css";

function WeaponGen() {
  const [isLoading, setLoading] = useState(true);
  const [weaponArr, setWeaponArr] = useState([]);
  const [checked, setChecked] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    apiCalls.getAllWeapons().then((response) => {
      const sortingArray = [...response.data];
      sortingArray.sort((a, b) => {
        const sortOrder = [
          "Sidearm",
          "Shotgun",
          "SMG",
          "Rifle",
          "Sniper",
          "Heavy",
          "Melee",
        ];
        const firstCat = a.category.split("::")[1];
        const secondCat = b.category.split("::")[1];
        const firstIndex = sortOrder.indexOf(firstCat);
        const secondIndex = sortOrder.indexOf(secondCat);
        if (firstIndex === secondIndex) {
          if (a.shopData.cost < b.shopData.cost) return -1;
          if (a.shopData.cost >= b.shopData.cost) return 1;
        } else if (firstIndex < secondIndex) return -1;
        else return 1;
      });
      setWeaponArr(sortingArray);
      setChecked(new Array(response.data.length).fill(true));
      const storedWeaponState = localStorage.getItem("weaponState");
      if (storedWeaponState) {
        setChecked(JSON.parse(storedWeaponState));
      }
      setLoading(false);
    });
  }, []);

  const handleHeaderClick = (event) => {
    event.preventDefault();
    const buttonClicked = event.target.id;
    console.log(buttonClicked);
    if (buttonClicked === "agent") {
      window.location.href = "/";
    } else {
      window.location.href = `/${buttonClicked}`;
    }
  };

  const handleCheckClick = (position) => {
    const updatedCheckedState = checked.map((item, index) =>
      index === position ? !item : item
    );
    localStorage.setItem("weaponState", JSON.stringify(updatedCheckedState));
    setChecked(updatedCheckedState);
  };
  const formHandler = async (event) => {
    event.preventDefault();
    const selectedWeapons = weaponArr.filter((weapon, index) => {
      return checked[index];
    });
    const generatedWeapon = randomize(selectedWeapons);
    const weaponBlock = (
      <div id="generatedWeaponContainer">
        <h2>{generatedWeapon.displayName}</h2>
        <h4>
          <i>{generatedWeapon.category.split("::")[1]}</i>
        </h4>
        <img
          id="generatedWeaponPortrait"
          alt="portrait of Weapon"
          src={generatedWeapon.displayIcon}
        />
        <a id="moreInfo-link" href={`/moreInfo?weapon=${generatedWeapon.uuid}`}>
          More about the {generatedWeapon.displayName}
        </a>
      </div>
    );
    if (Auth.loggedIn()) {
      const userData = Auth.getProfile();
      await apiCalls.updateUserHistory(
        { weaponId: generatedWeapon.uuid },
        userData._id,
        "weapon",
        Auth.getToken()
      );
    }
    setResult(weaponBlock);
    document.getElementById("resultContainer").classList.remove("hidden");
    document.getElementById("weaponSelectForm").classList.add("hidden");
    document
      .getElementById("extraFunctionButton-container")
      .classList.add("hidden");
  };

  const changeSettings = (event) => {
    event.preventDefault();
    document.getElementById("resultContainer").classList.add("hidden");
    document.getElementById("weaponSelectForm").classList.remove("hidden");
    document
      .getElementById("extraFunctionButton-container")
      .classList.remove("hidden");
  };

  const changeAllHandler = (boolean) => {
    setChecked(checked.map(() => boolean));
    localStorage.setItem(
      "weaponState",
      JSON.stringify(checked.map(() => boolean))
    );
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  let weaponSelect = [];

  for (let i = 0; i < weaponArr.length; i++) {
    const block = (
      <div
        id={weaponArr[i].uuid}
        className="weaponSelectThumbnailContainer"
        key={weaponArr[i].displayName}
      >
        <h2
          className={
            checked[i]
              ? "caret-hidden weaponCaption"
              : "caret-hidden weaponCaption inactive-text"
          }
        >
          {weaponArr[i].displayName}
        </h2>
        <img
          id={weaponArr[i].displayName}
          className={`weaponSelectThumbnail ${
            checked[i] ? "active" : "inactive"
          }`}
          alt={`Portrait of ${weaponArr[i].displayName}`}
          src={weaponArr[i].displayIcon}
        />
        <input
          id={i}
          type="checkbox"
          className="weaponSelect-checkbox"
          onChange={() => {
            handleCheckClick(i);
          }}
          checked={checked[i]}
        />
      </div>
    );
    weaponSelect.push(block);
  }

  return (
    <div id="weaponGenContainer">
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
          className="header-button"
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
      <form id="weaponSelectForm" onSubmit={formHandler}>
        <div
          id="weaponSelectContainer"
          onClick={(e) => {
            if (e.target.nextSibling) {
              if (e.target.id === "weaponSelectContainer") {
                return;
              }
              if (e.target.nextSibling.nextSibling) {
                const i = e.target.nextSibling.nextSibling.id;
                const newState = [...checked];
                newState.splice(i, 1, !checked[i]);
                localStorage.setItem("weaponState", JSON.stringify(newState));
                setChecked(newState);
              } else {
                const i = e.target.nextSibling.id;
                const newState = [...checked];
                newState.splice(i, 1, !checked[i]);
                localStorage.setItem("weaponState", JSON.stringify(newState));
                setChecked(newState);
              }
            }
          }}
        >
          {weaponSelect}
        </div>
        <button
          type="submit"
          id="weaponSelect-submitBtn"
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

export default WeaponGen;
