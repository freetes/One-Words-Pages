<template>
  <div class="home">
    <div v-for="item in oneWords" :key="item._id">
      <p>{{ item.content }}</p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import moment from 'moment'

const BASE_URL = 'https://api.grayclass.site:2333/api'

export default {
  name: 'onewords',
  data: ()=>{
    return {
      groupId: '',
      oneWords: []
    }
  },
  methods: {
    findGroup: async function (){
      let result = await axios.post(BASE_URL + '/searchGroupByCode', {code: this.code})

      if(result.data.data.length > 0){
        this.$router.push('/onewords')
      }
    }
  },

  async created(){
    this.groupId = this.$route.params.id

    let time = Date.now() - 2000, count = 0

    setInterval(() => {
      count ++
      console.log(`第 ${count}次 获取`)
      time += 2000

      axios.post(BASE_URL + '/getOneWordsByGroupId', {groupId: this.groupId, time: moment(time).toISOString()})
      .then(res=>{
        for(let item of res.data.data){
          item.createAt = moment(item.create_at).fromNow()
        }

        this.oneWords = this.oneWords.concat(res.data.data)
      })
    }, 2000);

  }
}
</script>
