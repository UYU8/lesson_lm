// 全局共享的用户状态

import { defineStore } from "pinia";
import {
    ref,
    reactive
} from "vue";
// hooks 编程
export const useUserStore = defineStore("users",() => {
    const isLogin = ref(false);
    const tologin = () => {
        isLogin.value = true;
    }
    const tologout = () => {
        isLogin.value = false;
    }

    const userInfo = reactive({
        name:"",
        avatar:"",
        message:0,
        uid:null
    })

    const setUserInfo = (info) => {
        userInfo.name = info.name;
        userInfo.avatar = info.avatar;
        userInfo.message = info.message;
        userInfo.uid = info.uid;
    }

    return{
        isLogin,
        tologin,
        tologout,
        userInfo,
        setUserInfo
    }
})