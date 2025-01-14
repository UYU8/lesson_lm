<template>
    <el-form 
      style="position:absolute;left:45%" 
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="auto"
    >

    <el-form-item label="用户名" prop="name">
      <el-input v-model="form.name" size="small"/>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="form.password" type="password" size="small"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" :loading="loading">
        登录
        </el-button>
      </el-form-item>

    </el-form>
</template>

<script setup>
import { ref,reactive } from 'vue';
const formRef = ref(null);
// 表单数据 
const form = reactive({
  name: '',
  password: ''
})
const rules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 10, message: '长度在5-10个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 10, message: '长度在5-10个字符', trigger: 'blur' }
    ]
}

const loading = ref(false);
const onSubmit = async () => {
  // console.log(formRef.value)
  loading.value = true;
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('验证成功');
    } else {
      console.log('验证失败');
    }
  });
}

</script>

<style scoped>

</style>