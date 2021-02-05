<template>
<v-container>
  <v-layout row>
    <v-flex xs12>
      <v-card
      class="elevation-4 mb-5"
      >
      <v-layout rox>
      <v-flex xs4>
            <v-img 
            :src="people.photo"
            height="300px"
            width="300px"
            ></v-img>
      </v-flex>
      <v-flex xs8>
            <v-card-text>
              <h1 class="text--primary"><b>Имя:</b> {{people.name}}</h1>
              <br>
              <p><b>Дата создания:</b> {{people.created.split('T')[0].split('-').reverse().join('.')}}
              <br><b>Год рождения персонажа:</b> {{people.birth_year}}
              <br><b>Пол персонажа:</b> {{people.gender}}
              <br><i>Информация о корабле / кораблях персонажа:</i></p>
              <div v-if="starship.length !== 0"><ol><li v-for="starshipI of starship" :key="starshipI.starshipId"><b>Модель корабля:</b> {{starshipI.model}}<br/><b>Название корабля:</b> {{starshipI.name}}</li></ol>
              </div> <div v-else>
              <p>Кораблей нет</p>
              </div>
            </v-card-text>
       </v-flex>  
       </v-layout>   
      </v-card>
    </v-flex>
  </v-layout>
</v-container>

</template>
<script>
  export default {
    name: 'People',
    props: ['id'],
    data: () => ({
      starshipList: []
    }),
    computed: {
      people () {
        const id = this.id;
        return this.$store.getters.peopleById(id);
      },
      starship () {
        const id = Number(this.id);
        let people = this.$store.getters.peopleById(id);
        let starshipStr = people.starships;
        let starshipList = [];
        for (let starship of starshipStr){
          let starshipPath = Number(starship.slice(starship.lastIndexOf('starships') + 10).slice(0, -1));
          if (this.$store.getters.starshipById(starshipPath)) starshipList.push(this.$store.getters.starshipById(starshipPath));
        }
        return starshipList;
      }
    },
    created () {
      const id = this.id;
      let people = this.$store.getters.peopleById(id);
      if (people.starships !== []) {
        this.$store.dispatch('fetchStarshipsList', people.starships);
      }
    }
  }
</script>
