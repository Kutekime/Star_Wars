import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var swapiModule = (function() {
  var rootURL = "https://swapi.dev/api/";

  function request(url, cb) {
    return fetch(url)
      .then(function(res) {
        return res.json();
      })
      .then(function(data) {
        if (typeof cb === "function") {
          cb(data);
        }

        return data;
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function getResources(cb) {
    return request(rootURL, cb);
  }

  function singularRequestGenerator(path) {
    return function(id, cb) {
      return request(rootURL + path + "/" + id + "/", cb);
    };
  }

  function pluralRequestGenerator(path) {
    return function() {
      let queryObject = undefined;
      let cb = undefined;
      if (arguments.length > 1) {
        queryObject = arguments[0];
        cb = arguments[1];
      } else if (arguments[0]) {
        if (typeof arguments[0] === "function") {
          cb = arguments[0];
          queryObject = null;
        } else {
          cb = null;
          queryObject = arguments[0];
        }
      }
      if (queryObject) {
        let searchParams = new URLSearchParams();
        for (let key of Object.keys(queryObject)) {
          let value = queryObject[key];
          searchParams.append(key, value);
        }
        return request(rootURL + path + "/?" + searchParams.toString(), cb);
      }
      return request(rootURL + path + "/", cb);
    };
  }

  return {
    getResources: getResources,
    getPerson: singularRequestGenerator("people"),
    getPeople: pluralRequestGenerator("people"),
    getFilm: singularRequestGenerator("films"),
    getFilms: pluralRequestGenerator("films"),
    getPlanet: singularRequestGenerator("planets"),
    getPlanets: pluralRequestGenerator("planets"),
    getSpecies: singularRequestGenerator("species"),
    getAllSpecies: pluralRequestGenerator("species"),
    getStarship: singularRequestGenerator("starships"),
    getStarships: pluralRequestGenerator("starships"),
    getVehicle: singularRequestGenerator("vehicles"),
    getVehicles: pluralRequestGenerator("vehicles")
  };
})();

class PeopleList {
  constructor (photo = 'https://robohash.org/CutemanShow', name, created, birth_year, gender, starships = undefined, pageId = 1) {
    this.photo = 'https://robohash.org/' + photo;
    this.name = name;
    this.created = created;
    this.birth_year = birth_year;
    this.gender = gender;
    this.starships = starships;
    this.pageId = pageId;
  }
}

class StarshipsList {
  constructor (name, model, starshipId) {
    this.name = name;
    this.model = model;
    this.starshipId = starshipId;
  }
}

export default new Vuex.Store({
  state: {
    peopleList: {},
    starshipsList: [],
    pageNumber: 1
  },
  mutations: {
    createPeople (state, {pageIndex, resultPeopleList}) {
      state.peopleList = { ...state.peopleList, [pageIndex]: resultPeopleList };
    },
    loadPeopleList (state, payload) {
      state.peopleList = payload;
    },
    loadStarshipList (state, payload) {
      state.starshipsList = payload;
    },
    changePageNubmer (state, payload) {
      state.pageNumber = payload;
    }
  },
  actions: {
    async fetchPeopleList ({commit}, num) {
      if (this.state.peopleList[num]) return true;
      const resultPeopleList = [];
       try {
        const swapiVal = await swapiModule.getPeople({page: num});
        const peopleL = swapiVal.results;
        if (peopleL){
          Object.keys(peopleL).forEach(key => {
            const people = peopleL[key];
            resultPeopleList.push (
            new PeopleList(people.name.replace(/\s/g, ''), people.name, people.created, people.birth_year, people.gender, people.starships, Number(key)+1 + (num-1)*10)
            )
          })
        }
        commit('createPeople', {resultPeopleList, pageIndex: num});
      } catch (error) {
        console.Console('error');
        throw error;
      }
     },
  
    async fetchStarshipsList ({commit}, starships) {

      const resultStarshipList = [];
      try {
        for (let starship of starships) {
          let starshipPath = Number(starship.slice(starship.lastIndexOf('starships') + 10).slice(0, -1));
          const swapiVal = await swapiModule.getStarship(starshipPath);
          resultStarshipList.push (
            new StarshipsList(swapiVal.name, swapiVal.model, starshipPath)
          )
          commit('loadStarshipList', resultStarshipList);
        }
        
      } catch (error) {
        console.Console('error');
        throw error;
      }
   },
   changePageNubmer ({commit}, payload) {
    commit('changePageNubmer', payload);
  },
  },
  getters: {
    peopleList (state) {
      return num => state.peopleList[num] || [];
    },
    peopleById (state) {
      return pageId => state.peopleList[state.pageNumber].find(poeple => poeple.pageId === Number(pageId))
    },
    starshipById (state) {
      if (state.starshipsList) {
      return starshipId => state.starshipsList.find(starship => starship.starshipId === starshipId)
      }
    },
    getChangePageNubmer(state){
      return state.pageNumber;
    }
  },
  modules: {
  }
})
