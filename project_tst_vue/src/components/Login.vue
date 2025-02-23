<template>
  <div class="container mt-5 text-center w-10">
    <h1 class="mb-4">Login</h1>
    <form @submit.prevent="login">
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" v-model="email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Senha:</label>
        <input type="password" v-model="password" class="form-control" required />
      </div>
      <button type="submit" class="btn btn-primary">Entrar</button>
    </form>
    <button type="button" class="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#registerModal">
      Registrar
    </button>
    <p v-if="error" class="text-danger mt-3">{{ error }}</p>

    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerModalLabel">Registrar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Register />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from '../axios';
import Register from './Register.vue'; 

export default defineComponent({
  components: {
    Register,
  },
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const login = async () => {
      try {
        const response = await axios.post('/login', {
          email: email.value,
          password: password.value,
        });
        localStorage.setItem('token', response.data.token);
        window.location.href = '/dashboard';
      } catch (err) {
        error.value = 'Invalid email or password';
      }
    };

    return {
      email,
      password,
      error,
      login,
    };
  },
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>