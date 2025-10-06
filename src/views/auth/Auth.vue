<template>
  <div class="login-container">
    <n-card title="Авторизация АЗС" class="card">
      <n-form :model="formValue" :rules="rules" ref="formRef" :label-width="80">
        <n-form-item label="Логин" path="mail">
          <n-input
            type="text"
            v-model:value="formValue.mail"
            placeholder="Введите логин"
            :disabled="loading"
            autocomplete="username"
          />
        </n-form-item>
        <n-form-item label="Пароль" path="password">
          <n-input
            type="password"
            autocomplete="current-password"
            v-model:value="formValue.password"
            placeholder="Введите пароль"
            :disabled="loading"
            @keydown.enter="handleValidateClick"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            block
            type="primary"
            @click="handleValidateClick"
            :loading="loading"
          >
            Войти
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import { useAuth } from "@/views/auth/useAuth.ts"

  const { loginHandler, rules, formRef, formValue, loading } = useAuth()

  const handleValidateClick = async (e: MouseEvent) => {
    e.preventDefault()
    formRef.value?.validate((errors) => {
      if (!errors) {
        loginHandler(formValue.value.mail, formValue.value.password)
      } else {
        console.log(errors)
      }
    })
  }
</script>

<style>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    min-height: 100vh;
  }

  .card {
    width: 400px;
  }
</style>
