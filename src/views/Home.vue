<template>
  <div class="home">
    <input type="text" name="" v-model="code" id="">
    <button @click="findGroup">搜索</button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'

const BASE_URL = 'https://api.grayclass.site/api'

export default {
  name: 'home',
  data: ()=>{
    return {
      code: ''
    }
  },
  methods: {
    findGroup: async function (){
      let result = await axios.post(BASE_URL + '/searchGroupByCode', {code: this.code})
      console.log(result)
    }
  },
}
</script>
