<template>
    <div class="container">
    <!-- 导航 -->
    <!-- html5 语义化标签 -->
      <nav class="nav">
        <div class="time">{{ localTime }}</div>
        <div class="city">切换城市</div>
      </nav>
      <main class="city-info">
        <div class="city-name">{{ weatherData.city }}</div>
        <div class="weather">{{ weatherData.weather }}</div>
        <h2 class="temp">
        <!-- em 加粗 -->
          <em>{{ weatherData.temperature }}</em>
        </h2>
        <div class="detail">
          <span>风力：{{ weatherData.windPower }}级</span>
          <span>风向：{{ weatherData.windDirection }}级</span>
          <span>空气湿度：{{ weatherData.humidity }}级</span>
        </div>
      </main>
      <!-- 天气 -->
    </div>
</template>

<script setup>
import { ref,onMounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const localTime = ref("00:00");
const weatherData = ref({
  city: "北京",
  weather: "晴",
  temperature: 20,
  windPower: 1,
  windDirection: "东北",
  humidity: 50
});

const init_map = () => {
     AMapLoader.load({
        key:"e6752e51d158b999bd429363f948db0b",
        version:"2.0",
        plugins:['AMap.CitySearch']
     }).then((AMap)=>{
        AMap.plugin('AMap.CitySearch',function(){
            let citySearch = new AMap.CitySearch();
            citySearch.getLocalCity(function(status,result){
                if(status==='complete' && result.info === 'OK'){
                    console.log(result.city)
                }
            })
        })
})
};

// init_map();
onMounted(() => {
  init_map();
  setInterval(() => {
    localTime.value = new Date().toLocaleTimeString();
  }, 1000);
});
</script>

<style scoped>
  .container{
    min-height: 100vh;
    background-color: black;
    opacity: 0.6;
    color: #fff;
  }
  .nav{
    overflow: auto;
    padding: 10px;
  }
  .city{
    float: right;
  }
  .time{
    float: left;
  }
  .city-info{
    text-align: center;
  }
  .temp{
    font-size: 26px;
  }
  .temp em{
    font-size: 34px;
  }
</style> 