<template>
  <v-container>
     <v-layout row v-if="peopleList.length !== 0">
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--seconday mb-3">Персонажи Star Wars</h1>
        <v-card
        class="elevation-4 mb-5"
        v-for="people of peopleList"
        :key="people.pageId"
        >
          <v-layout rox>
            <v-flex xs4>
              <v-responsive
                height="160px"
              >
              <v-img :src="people.photo"></v-img>
              </v-responsive>
            </v-flex>
            <v-flex xs8>
              <v-card-text>
                <h2 class="text--primary">{{people.name}}</h2>
                <p>{{people.created.split('T')[0].split('-').reverse().join('.')}}</p>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" :to="'/people/' + people.pageId">Открыть</v-btn>
              </v-card-actions>
            </v-flex>
          </v-layout>
        </v-card>
        <a v-for="count of 9" :key="count+' count'" @click.prevent="param(count)">{{count}} </a>
        <br> <br>
      </v-flex>
    </v-layout>
    <v-layout row v-else-if="peopleList.length === 0">
      <v-flex xs12 class="text-center">
        <h1 class="text--primary">Список персонажей пока пуст</h1>
      </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',
    data() { return {
      num: this.$store.getters.getChangePageNubmer || 1
    }},
    computed: {
      peopleList () {
        let num = this.num ? this.num : 1;
         if (this.$route.query.page) 
         {
           num = this.$route.query.page;
           this.$store.dispatch('changePageNubmer', num);
           return this.$store.getters.peopleList(num);
        }
        return this.$store.getters.peopleList(num);
      },
    },
    methods: {
      param: function (num) {
        this.num = num;
        this.$route.query.page=num;
        this.$store.dispatch('changePageNubmer', num);
        this.$store.dispatch('fetchPeopleList', num);
      }
    }
  }
</script>
