<template>
  <div class="container">
    <div class="mt-5">
      <button class="btn btn-danger" @click="logout">Logout</button>
    </div>
    <div>
      <ListUsers/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from '../../axios';
import ListUsers from './ListUsers.vue'

export default defineComponent({
  components: {
    ListUsers,
  },
  setup() {
    const logout = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post('/logout', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          localStorage.removeItem('token');
          window.location.href = '/login';
        } catch (error) {
          console.error('Error logging out:', error);
        }
      }
    };

    return {
      logout,
    };
  },
});
</script>