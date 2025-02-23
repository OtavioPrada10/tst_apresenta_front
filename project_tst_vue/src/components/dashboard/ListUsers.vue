<template>
    <div class="container mt-5">
      <h1 class="mb-4">Lista de Usuários</h1>
      <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#registerModal">
        Novo
      </button>
      <table class="table table-striped mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
            <th>Tipo</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.cpf }}</td>
            <td>{{ user.type }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <button class="btn btn-warning btn-sm" @click="editUser(user)" data-bs-toggle="modal" data-bs-target="#registerModal">Editar</button>
              <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  
    <div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="registerModalLabel">{{ isEditing ? 'Editar Usuário' : 'Registrar' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <Register :user="selectedUser" @user-saved="fetchUsers" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import axios from '../../axios';
  import Register from '../Register.vue';
  
  export default defineComponent({
    name: 'ListUsers',
    components: {
      Register,
    },
    setup() {
      const users = ref([]);
      const selectedUser = ref(null);
      const isEditing = ref(false);
  
      const fetchUsers = async () => {
        try {
          const response = await axios.get('/user', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          users.value = response.data;
        } catch (error) {
          console.error('Erro ao buscar usuários:', error);
        }
      };
  
      const editUser = (user) => {
        selectedUser.value = { ...user };
        isEditing.value = true;
        const modalElement = document.getElementById('registerModal');
        if (modalElement) {
          const modalInstance = Modal.getInstance(modalElement) || new Modal(modalElement);
          modalInstance.show();
        }
      };
  
      const deleteUser = async (id) => {
        try {
          await axios.delete(`/user/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          fetchUsers();
        } catch (error) {
          console.error('Erro ao excluir usuário:', error);
        }
      };
  
      onMounted(() => {
        fetchUsers();
      });
  
      return {
        users,
        selectedUser,
        isEditing,
        fetchUsers,
        editUser,
        deleteUser,
      };
    },
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: auto;
  }
  </style>