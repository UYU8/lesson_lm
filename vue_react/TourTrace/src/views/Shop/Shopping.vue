<template>
  <div class="shopping ">
    <div class="fixed top-0 left-0 w-full h-[35rem] -z-10 transform -translate-y-0 bg-cover bg-center overflow-hidden"
     style="background-image: url('https://img2.baidu.com/it/u=3569028837,3948269640&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1067');">
</div>
    <header
      class="search flex items-center text-sm mt-4 mx-4 bg-gray-200 rounded-full shadow-md"
    >
      <div class="place font-bold text-lg font-serif">
        <div
          @click="showPicker = true"
          class="flex items-center w-24 justify-center"
        >
          <span class="place">{{ fieldValue }}</span>
          <van-icon name="arrow-down" />
        </div>

        <van-popup v-model:show="showPicker" round position="bottom">
          <van-picker
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>

      <van-search
        v-model="searchField"
        placeholder="商品/关键字"
        clearable
        
        shape="round"
        class="w-full rounded-full bg-opacity-50"
      >
      </van-search>
    </header>
    <main class="menu">
      <header
        class="min-h-18 rounded-2xl p-2 shadow-md mx-4 my-4 border bg-white bg-opacity-80"
      >
        <section class="topbar flex justify-around my-[0.5rem]">
          <div
            class="topbar-item flex flex-col items-center"
            v-for="item in topBarState"
            :key="item.title"
          >
            <div class="topbar-item__icon">
              <van-icon :name="item.icon" size="2rem" />
            </div>
            <div class="topbar-item__text text-xs font-bold">
              {{ item.title }}
            </div>
          </div>
        </section>
      </header>
      <body>
        <!-- 专属推荐 -->
        <section
          class="recommend mx-4 p-2 text-sm text-black bg-white bg-opacity-80 rounded-2xl shadow-md"
        >
          <div class="flex justify-between items-center">
            <h2 class="title font-bold text-lg flex items-center">
              专属推荐</h2>

              <p class="ml-2 text-xs justify-center mr-2 mb-2">
                <van-tag type="warning">{{ fieldValue }}</van-tag>
              </p>
            
          </div>
          <van-tabs v-model:active="active" class="">
            <van-tab
              :title="items.title"
              v-for="items in recommendItemState"
            >
              <div v-for="item in items.items"  class="item" :class="item.type">
                <div v-if="showRec(item.type)" class="text my-2 py-1 flex bg-gray-100 rounded-lg " >
                  <div class="item-img w-[10rem] h-[8rem] overflow-hidden rounded-lg">
                    <van-image :src="item.image" class="w-full h-full object-cover"></van-image>
                  </div>
                  <div class="ml-1 mt-2 ">
                    <div class="font-bold text-md text-left">{{item.title}}</div>
                    <div class="text-mms text-left mt-2 text-gray-800 line-clamp-2 w-28">{{ item.place }}</div>
                    <div class=" text-left font-semibold mt-4">￥{{ item.price }}元</div>
                    <div class="text-ls text-left text-gray-500 ">已售{{ item.market }}份</div>
                  </div>
                  <van-icon name="cart-o" color="#1989fa" class="relative bottom-[-6.5rem] right-[-1rem]" size="1.5rem" />
                </div>
                
              </div>
            </van-tab>
          </van-tabs>
        </section>
      </body>
    </main>
  </div>
  
</template>

<script setup>
import { ref } from "vue";
import { useShopStore } from "../../stores/shopStore.ts";
import { toRefs } from "vue";

const shopStore = useShopStore();
const searchField = ref("");
const { topBarState, recommendItemState } = toRefs(shopStore);

const columns = [
  { text: "北京", value: "1" },
  { text: "杭州", value: "2" },
  { text: "厦门", value: "3" },

];
const fieldValue = ref(columns[0].text);
const showPicker = ref(false);
const action = ref('1');
const onConfirm = ({ selectedOptions }) => {
  showPicker.value = false;
  fieldValue.value = selectedOptions[0].text;
  console.log(selectedOptions);
  
  action.value = selectedOptions[0].value;
  console.log(action.value);
  
};
console.log(action.value,'----');

let showRec=(val)=>{

  console.log(val,action.value,val===action.value);
  
  return val==action.value
}

</script>

<style scoped>
.showTopTips {
  background-color: #41b883;
}
</style>