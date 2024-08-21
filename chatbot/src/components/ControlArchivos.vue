<template>
  <div class="control-archivos">
    <h2 class="header">
      <img src="/src/assets/logoangel.png" alt="Angel Corella Chatbot Logo" class="chatbot-logo" />
      <span class="titulo">Gestión de Archivos</span>
    </h2>
    <input type="file" @change="seleccionarArchivo" />
    <button @click="subirArchivo">Subir Archivo</button>

    <ul>
      <li v-for="file in files" :key="file.name">
        {{ file.name }}
        <button @click="borrarArchivo(file.name)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectedFile: null,
      files: [] // Esta lista de archivos se rellenará de manera estática para la prueba de concepto
    }
  },
  methods: {
    seleccionarArchivo(event) {
      this.selectedFile = event.target.files[0]
    },
    subirArchivo() {
      if (!this.selectedFile) return
      // Simular la subida de archivos añadiéndolo a la lista de archivos
      this.files.push({ name: this.selectedFile.name })
      this.selectedFile = null
    },
    borrarArchivo(fileName) {
      // Simular la eliminación de archivos eliminándolo de la lista de archivos
      this.files = this.files.filter((file) => file.name !== fileName)
    }
  },
  mounted() {
    // Inicializar con algunos archivos para la prueba de concepto
    this.files = [{ name: 'matriculacion_2023_2024.pdf' }, { name: 'informacion_modulos.pdf' }]
  }
}
</script>
<style>
.control-archivos {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 800px;
  max-height: 800px;
  height: 90%;
  background: #ffffff;
  border-radius: 15px;
  overflow: hidden;
  opacity: 1;
  box-shadow:
    0 0 128px 0 rgba(0, 0, 0, 0.1),
    0 32px 64px -48px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  z-index: 9999;
}

.control-archivos.active {
  opacity: 1;
  pointer-events: auto;
}

.control-archivos .header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  text-align: center;
  color: #000000;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-archivos .header img {
  margin-right: auto;
}

.control-archivos input[type='file'],
.control-archivos button {
  display: block;
  margin: 15px auto;
}
.control-archivos .titulo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.control-archivos ul {
  list-style: none;
  padding: 0;
}

.control-archivos li {
  margin-bottom: 35px;
}

.control-archivos button {
  background-color: #ff5722;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
}

.control-archivos button:hover {
  background-color: #e64a19;
}

.chatbot-logo {
  width: 100px;
}
</style>
