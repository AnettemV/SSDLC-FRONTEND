<template>
  <div class="container">
    <h2 class="title">Mis Vacaciones</h2>

    <!-- Saludo y logout -->
    <div class="user-info">
      <span>Hola, {{ user.name }}</span>
      <button class="btn logout-btn" @click="handleLogout">Cerrar sesión</button>
    </div>

    <!-- Formulario de vacaciones -->
    <div class="vacation-form card">
      <h3>Solicitar Nueva Vacación</h3>
      <form @submit.prevent="crearVacacion">
        <div class="form-group">
          <label>Fecha inicio:</label>
          <input type="date" v-model="nueva.fecha_inicio" required />
        </div>

        <div class="form-group">
          <label>Fecha fin:</label>
          <input type="date" v-model="nueva.fecha_fin" required />
        </div>

        <div class="form-group">
          <label>Motivo:</label>
          <input type="text" v-model="nueva.motivo" placeholder="Opcional" />
        </div>

        <button class="btn submit-btn" type="submit">Solicitar</button>
      </form>
    </div>

    <!-- Historial -->
    <div class="history card">
      <h3>Historial de Vacaciones</h3>
      <ul v-if="vacaciones.length">
        <li v-for="v in vacaciones" :key="v.id" class="history-item">
          <strong>{{ v.fecha_inicio }} - {{ v.fecha_fin }}</strong>
          <p>{{ v.motivo || 'Sin motivo' }}</p>
        </li>
      </ul>
      <p v-else>No hay vacaciones registradas.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import axios from 'axios'

const API_URL = 'http://127.0.0.1:8000/api'
const router = useRouter()
const userStore = useUserStore()

const vacaciones = ref([])
const nueva = ref({
  fecha_inicio: '',
  fecha_fin: '',
  motivo: '',
})

const user = userStore.user

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}

const cargarVacaciones = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await axios.get(`${API_URL}/vacaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    vacaciones.value = res.data
  } catch (error) {
    console.error('Error cargando vacaciones:', error.response?.data || error.message)
  }
}

const crearVacacion = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return alert('No estás autenticado')

    await axios.post(`${API_URL}/vacaciones`, nueva.value, {
      headers: { Authorization: `Bearer ${token}` },
    })

    nueva.value = { fecha_inicio: '', fecha_fin: '', motivo: '' }
    cargarVacaciones()
  } catch (error) {
    console.error('Error creando vacación:', error.response?.data || error.message)
    alert('Error al crear vacación')
  }
}

onMounted(() => {
  if (!userStore.user) {
    router.push('/login')
  } else {
    cargarVacaciones()
  }
})
</script>

<style scoped>
/* Contenedor general */
.container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1f2937;
}

/* Título principal */
.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #2563eb;
}

/* Usuario y logout */
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: #467acf;
}

.logout-btn {
  background-color: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background-color: #dc2626;
}

/* Tarjetas */
.card {
  background: #f3f4f6;
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Formulario */
.vacation-form h3 {
  margin-bottom: 1rem;
  color: #1d4ed8;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #2563eb;
}

/* Botones */
.btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.submit-btn {
  background-color: #2563eb;
  color: white;
}

.submit-btn:hover {
  background-color: #1e40af;
}

/* Historial */
.history h3 {
  color: #2563eb;
  margin-bottom: 1rem;
}

.history-item {
  padding: 0.8rem;
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 0.7rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.history-item strong {
  display: block;
  margin-bottom: 0.2rem;
}
</style>

