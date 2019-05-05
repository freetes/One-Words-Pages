<template>
  <div class="home">
    <input type="number" v-model="code" :placeholder="message" />
    <button @click="findGroup">搜索</button>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import { setTimeout } from 'timers';

const BASE_URL = 'https://api.grayclass.site:2333/api'

export default {
  name: 'home',
  data: ()=>{
    return {
      code: '',
      message: '请输入群组ID'
    }
  },
  methods: {
    findGroup: async function (){
      let result = await axios.post(BASE_URL + '/searchGroupByCode', {code: this.code})

      if(result.data.data.length > 0){
        this.$router.push('/onewords/' + result.data.data[0]._id)
      }
      else{
        this.code = ''
        this.message = '群组ID错误，请检查'
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
</style>
