<template>
  <div>
    <form @submit.prevent="saveUser">
      <div class="mb-3">
        <label for="name" class="form-label">Nome:</label>
        <input type="text" v-model="user.name" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input type="email" v-model="user.email" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Senha:</label>
        <input type="password" v-model="user.password" class="form-control" :required="!isEditing" />
        <div v-if="errors.password" class="text-danger">{{ errors.password[0] }}</div>
      </div>
      <div class="mb-3">
        <label for="cpf" class="form-label">CPF:</label>
        <input type="text" v-model="user.cpf" class="form-control" required />
      </div>
      <div class="mb-3">
        <label for="type" class="form-label">Tipo:</label>
        <select v-model="user.type" class="form-control" required>
          <option value="Física">Física</option>
          <option value="Jurídica">Jurídica</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="phone" class="form-label">Telefone:</label>
        <input type="text" v-model="user.phone" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">{{ isEditing ? 'Salvar' : 'Registrar' }}</button>
    </form>
    <p v-if="error" class="text-danger mt-3">{{ error }}</p>
    <p v-if="successMessage" class="text-success mt-3">{{ successMessage }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';
import axios from '../axios';
import { Modal } from 'bootstrap';

export default defineComponent({
  name: 'Register',
  props: {
    user: {
      type: Object as PropType<any>,
      default: () => null,
    },
  },
  setup(props, { emit }) {
    const user = ref({
      name: '',
      email: '',
      password: '',
      cpf: '',
      type: 'Física',
      phone: '',
    });
    const error = ref('');
    const successMessage = ref('');
    const errors = ref({});
    const isEditing = ref(false);

    watch(
      () => props.user,
      (newUser) => {
        if (newUser) {
          user.value = { ...newUser };
          isEditing.value = true;
        } else {
          user.value = {
            name: '',
            email: '',
            password: '',
            cpf: '',
            type: 'Física',
            phone: '',
          };
          isEditing.value = false;
        }
      },
      { immediate: true }
    );

    const saveUser = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`/user/${user.value.id}`, user.value, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        } else {
          await axios.post('/register', user.value);
          const modalElement = document.getElementById('registerModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
            modalInstance.hide();
            modalElement.addEventListener('hidden.bs.modal', () => {
              document.body.classList.remove('modal-open');
              const backdrop = document.querySelector('.modal-backdrop');
              if (backdrop) {
                backdrop.remove();
              }
            }, { once: true });
          }
        }
        emit('user-saved');
        successMessage.value = 'Registro alterado com sucesso!';
        setTimeout(() => {
          successMessage.value = '';
        }, 3000);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.errors) {
          errors.value = err.response.data.errors;
        } else {
          error.value = 'Erro ao salvar usuário. Tente novamente.';
        }
      }
    };

    return {
      user,
      error,
      successMessage,
      errors,
      isEditing,
      saveUser,
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