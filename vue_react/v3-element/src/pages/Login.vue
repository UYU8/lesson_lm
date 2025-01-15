<template>
  <el-form
    style="position:absolute;left:45%"
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="auto"
  >
    <el-form-item label="Name" prop="name">
      <el-input v-model="form.name" for="Name" size="small" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input v-model="form.password" for="password" type="password" size="small" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="loading">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { login } from '../api/';

const formRef = ref(null);
// 表单数据
const form = reactive({
  name: '',
  password: ''
});
const rules = {
    "name": [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 10, message: '长度在5-10个字符', trigger: 'change' }
    ],
    "password": [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 10, message: '长度在5-10个字符', trigger: 'change' }
    ]
}
const loading = ref(false);
const onSubmit = async () => {
  // console.log(formRef.value)
  loading.value = true
  await formRef.value.validate(async(valid) => {
    // 发送请求给后端？
    // 验证，账号密码和数据库中是否匹配
    // 发送给前端一个凭证 token
    // 以后的请求 都需要套携带这个凭证
    // 服务器解析凭证 得到用户对象
    if (valid) {
      console.log('验证成功');
      const res = await login(form);
      console.log(res);
    } else {
      console.log('验证失败');
    }
  });
}

</script>

<style scoped>

</style>