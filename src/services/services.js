import Auth from "./auth";
//this is undefined because during development I am using a proxy
const dbLink = "https://valorandombackend.herokuapp.com";
const valorantApiLink = "https://valorant-api.com/v1";

class ApiCalls {
  async getSingleUser(userId, token) {
    const url = `${dbLink}/api/user/${userId}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return await response.json();
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async checkUsername(username) {
    const url = `${dbLink}/api/user/username/${username}`;
    try {
      const response = await fetch(url);
      const deliverable = await response.json();
      return deliverable.result;
    } catch (err) {
      console.log(err);
    }
  }

  async createUser(data) {
    try {
      const url = `${dbLink}/api/user`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(response);
      const deliverable = await response.json();
      Auth.login(deliverable.token);
      return deliverable;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async updateUser(data, userId, token) {
    try {
      const url = `${dbLink}/api/user/${userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const deliverable = await response.json();
      Auth.login(deliverable.token);
      return deliverable;
    } catch (err) {
      console.log(err);
    }
  }

  async updateUserHistory(data, userId, field, token) {
    try {
      const url = `${dbLink}api/user/history/${userId}/${field}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async login(data) {
    try {
      const url = `${dbLink}/api/user/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const deliverable = await response.json();
      Auth.login(deliverable.token);
      return deliverable;
    } catch (err) {
      console.log(err);
    }
  }

  async getAllAgents() {
    try {
      const localInfo = JSON.parse(localStorage.getItem("allAgents"));
      if (localInfo) {
        const storedDate = JSON.parse(localStorage.getItem("agentDate"));
        const staleData = this.checkForStaleInfo(storedDate);
        if (!staleData) {
          return localInfo;
        }
      }
      const url = `${valorantApiLink}/agents?isPlayableCharacter=true`;
      const agentInfo = await fetch(url);
      const deliverable = await agentInfo.json();
      localStorage.setItem("allAgents", JSON.stringify(deliverable));
      const today = new Date();
      localStorage.setItem(
        "agentDate",
        JSON.stringify({
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate(),
        })
      );
      return deliverable;
    } catch (err) {
      console.log(err);
    }
  }

  async getOneAgent(agentId) {
    try {
      const url = `${valorantApiLink}/agents/${agentId}`;
      const agentInfo = await fetch(url);
      if (agentInfo.status < 300) {
        return await agentInfo.json();
      } else {
        return "agent not found";
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getAllWeapons() {
    try {
      const localInfo = JSON.parse(localStorage.getItem("allWeapons"));
      if (localInfo) {
        const storedDate = JSON.parse(localStorage.getItem("weaponDate"));
        const staleData = this.checkForStaleInfo(storedDate);
        if (!staleData) {
          return localInfo;
        }
      }
      const url = `${valorantApiLink}/weapons`;
      const weaponInfo = await fetch(url);
      const deliverable = await weaponInfo.json();
      localStorage.setItem("allWeapons", JSON.stringify(deliverable));
      const today = new Date();
      localStorage.setItem(
        "weaponDate",
        JSON.stringify({
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate(),
        })
      );
      return deliverable;
    } catch (err) {
      console.log(err);
    }
  }

  async getOneWeapon(weaponId) {
    try {
      const url = `${valorantApiLink}/weapons/${weaponId}`;
      const weaponInfo = await fetch(url);
      if (weaponInfo.status < 300) {
        return await weaponInfo.json();
      } else {
        return "weapon not found";
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getAllStrategies() {
    try {
      const localInfo = JSON.parse(localStorage.getItem("allStrategies"));
      if (localInfo) {
        const storedDate = JSON.parse(localStorage.getItem("strategyDate"));
        const staleData = this.checkForStaleInfo(storedDate);
        if (!staleData) {
          return localInfo;
        }
      }
      const url = `${dbLink}/api/strategy/`;
      const strategyInfo = await fetch(url);
      const deliverable = await strategyInfo.json();
      localStorage.setItem("allStrategies", JSON.stringify(deliverable));
      const today = new Date();
      localStorage.setItem(
        "strategyDate",
        JSON.stringify({
          year: today.getFullYear(),
          month: today.getMonth(),
          day: today.getDate(),
        })
      );
      return deliverable;
    } catch (err) {
      console.log(err);
    }
  }

  async getFilteredStrategies(filterObj) {
    //filterObj will have either a class or side key or both
    const localInfo = JSON.parse(localStorage.getItem("allStrategies"));
    if (localInfo) {
      const storedDate = JSON.parse(localStorage.getItem("strategyDate"));
      const staleData = this.checkForStaleInfo(storedDate);
      if (!staleData) {
        const filteredArray = localInfo.filter((strategy) => {
          if (filterObj.class && filterObj.side) {
            return (
              strategy.class === filterObj.class &&
              (strategy.side === filterObj.side || strategy.side === "na")
            );
          } else if (filterObj.class) {
            return strategy.class === filterObj.class;
          } else {
            return strategy.side === filterObj.side || strategy.side === "na";
          }
        });
        return filteredArray;
      }
    }
    let url = "";
    if (filterObj.class && filterObj.side) {
      url = `${dbLink}/api/strategy/class/side/${filterObj.class}/${filterObj.side}`;
    } else if (filterObj.class) {
      url = `${dbLink}/api/strategy/class/${filterObj.class}`;
    } else {
      url = `${dbLink}/api/strategy/side/${filterObj.side}`;
    }
    try {
      const strategyInfo = await fetch(url);
      const deliverable = await strategyInfo.json();
      if (deliverable) {
        return deliverable;
      } else {
        return ["No strategies found"];
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getOneStrategy(strategyId) {
    try {
      const url = `${dbLink}/api/strategy/${strategyId}`;
      const strategyInfo = await fetch(url);
      if (strategyInfo.status < 300) {
        return await strategyInfo.json();
      } else {
        return "strategy not found";
      }
    } catch (err) {
      console.log(err);
    }
  }

  async addWinOrLoss(strategyId, wol) {
    try {
      const url = `${dbLink}/api/strategy/${strategyId}/${wol}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  checkForStaleInfo(date) {
    if (!date) {
      return false;
    }
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const oldYear = date.year;
    const oldMonth = date.month;
    const oldDay = date.day;
    if (oldYear < year) {
      return true;
    } else if (oldMonth < month) {
      return true;
    } else if (oldDay < day) {
      return true;
    } else {
      return false;
    }
  }
}

export default new ApiCalls();
