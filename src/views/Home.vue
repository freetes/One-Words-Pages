<template>
  <div class="home" :class="{'top': !!groupId}">
    <div class="inputs">
      <input type="number" v-model="code" :placeholder="message" />
      <button @click="findGroup">搜索</button>
    </div>

    <div class="group-info">
      <p class="name">{{ groupInfo.name }}</p>
      <p class="description">{{ groupInfo.description }}</p>
    </div>

    <div v-if="oneWords.length > 0" class="onewords">
      <div class="oneword" v-for="item in oneWords" :key="item._id">
        <p>{{ item.content }}</p>
      </div>
    </div>

    <p class="words" v-if="!!groupId">请打开小程序端，我的班级 -> 交互 -> 「发送弹幕」</p>

  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import moment from 'moment'
import { setTimeout } from 'timers';

const BASE_URL = 'https://api.grayclass.site:2333/api'

export default {
  name: 'home',
  data: ()=>{
    return {
      code: '',
      message: '请输入群组ID',
      groupId: '',
      oneWords: [],
      groupInfo: {}
    }
  },

  methods: {
    findGroup: async function (){
      let result = await axios.post(BASE_URL + '/searchGroupByCode', {code: this.code})

      if(result.data.data.length > 0){
        this.groupId = result.data.data[0]._id
        this.groupInfo = result.data.data[0]

        this.oneWords = []

        let time = Date.now() - 2000, count = 0

        setInterval(() => {
          count ++
          console.log(`第 ${count}次 获取`)
          time = Date.now() - 2000

          axios.post(BASE_URL + '/getOneWordsByGroupId', {groupId: this.groupId, time: moment(time).toISOString()})
          .then(res=>{
            for(let item of res.data.data){
              item.createAt = moment(item.create_at).fromNow()
            }

            this.oneWords = this.oneWords.concat(res.data.data)
          })
        }, 2000);
      }
      else{
        this.code = ''
        this.message = '群组ID错误，请检查'
        this.groupId = ''
        this.groupInfo = {}
      
        setTimeout(()=>{
          this.message = '请输入群组ID'
        }, 2000)
      }
    }
  },
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
  justify-content: center;
  align-items: center;

  >.inputs{
    width: 300px;
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    >input{
      padding: 5px 15px;
      font-size: 16px;
      line-height: 20px;
      border-radius: 15px;
      border: 1px solid gray;
      outline: none;
    }
    >button{
      margin-left: 20px; 
      padding: 5px 15px;
      font-size: 16px;
      line-height: 20px;
      border-radius: 15px;
      border: 1px solid gray;
      color: black;
      background-color: white;
      font-weight: bold;
      outline: none;
      cursor: pointer;
    }
    >button:hover{
      color: white;
      background-color: black;
    }

  }

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

.top{
  justify-content: flex-start;
}
</style>
