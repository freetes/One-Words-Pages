<template>
  <div class="home">
    <div class="group-info">
      <p class="name">{{ groupInfo.name }}</p>
      <p class="description">{{ groupInfo.description }}</p>
    </div>
    <div v-if="oneWords.length > 0" class="onewords">
      <div class="oneword" v-for="item in oneWords" :key="item._id">
        <p>{{ item.content }}</p>
      </div>
    </div>
    <p class="words" v-else>请打开小程序端，我的班级 -> 交互 -> 「发送弹幕」</p>
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
      oneWords: [],
      groupInfo: {}
    }
  },
  methods: {
  },

  async created(){
    this.groupId = this.$route.params.id

    let result = await axios.post(BASE_URL + '/getGroupInfoById', {groupId: this.groupId})

    this.groupInfo = result.data.data

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

<style lang="less">
*{
  margin: 0;
  padding: 0;
}

.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  >.group-info{
    display: flex;
    flex-direction: column;
    justify-content: center;    
    align-items: center;
    border-bottom: 1px solid gray;

    >.name{
      font-size: 26px;
      color: black;
      font-weight: bold;
      padding: 30px 0;
    }
    >.description{
      font-size: 16px;
      color: black;
      padding: 10px 0;
    }
  }

  >.onewords{
    padding: 20px 0;
  }
  >.words{
    padding: 20px 0;
  }
}
</style>
