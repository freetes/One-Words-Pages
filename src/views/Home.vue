<template>
  <div class="home" :class="{'top': !!groupId}">
    <div class="inputs" v-if="!groupId">
      <input type="number" v-model="code" :placeholder="message" />
      <button @click="findGroup">搜索</button>
    </div>

    <div class="group-info" v-else>
      <img :src="groupInfo.filePath" alt="">
      <p class="name">{{ groupInfo.name }}</p>
    </div>

    <div class="onewords" v-if="groupId" :style="{'max-height': oneWordsContainerHeight + 'px'}">
      <div class="oneword" v-for="item in oneWords" :key="item._id">
        <img v-show="!item.hidden" :src="item.creater.wxInfo.avatarUrl" alt="">
        <p v-show="!item.hidden">{{ item.content }}</p>
      </div>
    </div>

    <div class="words" v-if="groupId">
      <p>{{ oneWords.length==0?'请打开小程序端，我的群组 - 互动 - 「发送弹幕」':'持续接受弹幕中...' }}</p>
    </div>
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
      groupInfo: {},
      count: 0,
      oneWordsContainerHeight: 0
    }
  },

  methods: {
    findGroup: async function (){
      let result = await axios.post(BASE_URL + '/searchGroupByCode', {code: this.code})

      if(result.data.data.length > 0 && result.data.data[0].status!=-2){
        this.groupId = result.data.data[0]._id
        result.data.data[0].filePath = 'https://api.grayclass.site:2333' + result.data.data[0].filePath
        this.groupInfo = result.data.data[0]

        this.oneWords = []

        let count = 0

        setInterval(() => {
          axios.post(BASE_URL + '/getOneWordsByGroupId', {groupId: this.groupId, count})
          .then(res=>{
            count = res.data.data.oneWords.length + res.data.data.amount

            for(let i = 0, length = this.oneWords.length; i < res.data.data.oneWords.length; i++){
              let id = res.data.data.oneWords[i]._id
              res.data.data.oneWords[i].createAt = moment(res.data.data.oneWords[i].create_at).fromNow()

              // 卸载弹幕
              setTimeout(()=>{
                for(let j = 0; j < this.oneWords.length; j++){
                  if(id == this.oneWords[j]._id){
                    this.oneWords[j].hidden = true
                    break
                  }
                }
              }, 15000)
            }

            this.oneWords = this.oneWords.concat(res.data.data.oneWords)
          })
        }, 1000);
      }
      else{
        this.code = ''
        this.message = '群组ID错误，请检查'
        this.groupId = ''
        this.groupInfo = {}
      
        setTimeout(()=>{
          this.message = '请输入群组ID'
        }, 1000)
      }
    }
  },

  created: function(){
    var h = document.documentElement.clientHeight || document.body.clientHeight;
    let oneWordsContainerHeight = h - 100 - 50
    this.oneWordsContainerHeight = oneWordsContainerHeight
  }
}
</script>

<style lang="less">
*{
  margin: 0;
  padding: 0;
}

.home {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #ededed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  >.inputs{
    flex: 0 0 auto;
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
    width: 100%;
    height: 100px;
    flex: 0 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;

    >img{
      height: 50px;
      width: 50px;
      border-radius: 50%;
      margin-right: 10px;
    }
    >.name{
      font-size: 28px;
      color: black;
      font-weight: bold;
    }
    >.description{
      font-size: 16px;
      color: black;
      padding: 10px 0;
    }
  }

  >.onewords{
    width: 100%;
    flex: 1 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 20px 0;

    >.oneword{
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-top: 15px;
      animation: showIn 15s linear;
      margin-left: -50%;

      @keyframes showIn {
        from {
          margin-left: 100%;
        }
        to {
          margin-left: -50%;
        }
      }

      >img{
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 5px;
        box-shadow: 3px 10px 10px lightgray;
      }
      >p{
        padding: 10px 20px;
        border-radius: 20px;
        text-align: left;
        line-height: 20px;
        font-size: 18px;
        background-color: white;
        border: 1px solid white;
        box-shadow: 3px 10px 10px lightgray;
        display: block;
        word-break: keep-all;
        white-space: nowrap;
        font-weight: bold;
      }
    }
  }
  >.words{
    flex: 0 0 auto;
    padding: 10px 0;

    >p{
      font-size: 18px;
      line-height: 30px;
    }
  }
}

.top{
  justify-content: flex-start;
}
</style>
