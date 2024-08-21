<template>
  <div>
    <div class="chatbot-icon-container">
      <button class="mostrar-chatbot" @click="mostrarChatbot">
        <span class="material-symbols-sharp"> robot </span>
      </button>
      <!-- <div class="tooltip" v-if="mostrarTooltip">Bienvenido a Casta, tu asistente virtual</div>-->
    </div>
    <!-- Chatbot -->
    <div v-show="showChatbot" class="chatbot" :class="{ active: showChatbot }">
      <header>
        <h2>
          <img
            src="/src/assets/logoangel.png"
            alt="Angel Corella Chatbot Logo"
            class="chatbot-logo"
          />
        </h2>
      </header>
      <!-- Chatbox -->
      <div class="chatbox" ref="chatbox">
        <ul v-if="!showHistorial">
          <li
            v-for="(message, index) in messages"
            :key="index"
            :class="{
              'chat incoming': message.type === 'bot',
              'chat outgoing': message.type === 'user'
            }"
          >
            <span v-if="message.type === 'bot'" class="material-symbols-outlined"> neurology </span>
            <p>{{ message.text }}</p>
          </li>
        </ul>
      </div>
      <!-- Chat input -->
      <div class="chat-input" v-if="!showHistorial">
        <textarea
          placeholder="Escribe un mensaje..."
          v-model="userInput"
          @input="adjustarTextarea"
          @keydown.enter.prevent="manejarChat"
          spellcheck="false"
          required
        ></textarea>
        <!-- Botón de enviar -->
        <span id="send-btn" class="material-symbols-rounded" @click="manejarChat">send</span>
        <!-- Botón de micrófono -->
        <span
          id="mic-btn"
          class="material-symbols-sharp"
          :class="{ active: listening }"
          @click="iniciarEscucha"
        >
          mic
        </span>
        <!-- Enlace para abrir ControlArchivos.vue en una nueva pestaña -->
        <span
          ><a @click="openControlArchivos" href="/controlarchivos" class="centrar" target="_blank"
            >PoC</a
          ></span
        >

        <!-- Botón para mostrar historial -->
        <span id="historial-btn" class="material-symbols-sharp" @click="mostrarHistorial"
          >chat</span
        >
      </div>

      <!-- Modal de historial -->
      <div v-if="showHistorial" class="modal historial">
        <div class="modal-content">
          <span class="close" @click="mostrarHistorial">&times;</span>
          <h2 class="historial-texto">Historial</h2>
          <ul class="chatbox">
            <li
              v-for="(message, index) in messages"
              :key="index"
              :class="{
                'chat incoming': message.type === 'bot',
                'chat outgoing': message.type === 'user'
              }"
            >
              <span v-if="message.type === 'bot'" class="material-symbols-outlined">
                neurology
              </span>
              <p>{{ message.text }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MiChatbot',
  data() {
    return {
      listening: false,
      showHistorial: false,
      showChatbot: false,

      messages: [{ type: 'bot', text: 'Hola buenas 👋 ¿Cómo puedo ayudarte?' }],
      userInput: '',
      API_KEY: '(api key here)'
    }
  },

  methods: {
    mostrarChatbot() {
      this.showChatbot = !this.showChatbot
    },
    mostrarHistorial() {
      this.showHistorial = !this.showHistorial
    },
    async manejarChat() {
      const message = this.userInput.trim()
      if (!message) return
      this.messages.push({ type: 'user', text: message })
      this.userInput = ''
      await this.$nextTick()
      this.scrollparaabajo()
      await this.generarRespuesta(message)
    },
    async iniciarEscucha() {
      try {
        const recognition = new window.webkitSpeechRecognition()
        recognition.lang = 'es-ES'
        recognition.start()

        recognition.onresult = async (event) => {
          if (event.results && event.results.length > 0 && event.results[0].length > 0) {
            const pregunta = event.results[0][0].transcript
            this.userInput = pregunta
            await this.manejarChat()
          }
        }

        recognition.onend = () => {
          // color vuelva a su
          setTimeout(() => {
            this.listening = false // Cambiar el estado de escucha
          }, 1000)
        }

        this.listening = true // Cambiar el estado de escucha
      } catch (error) {
        console.error('Error al iniciar el reconocimiento de voz:', error)
      }
    },
    async generarRespuesta(message) {
      const API_URL = 'https://api.openai.com/v1/chat/completions'
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY}`
      }
      const body = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
      })

      try {
        const response = await axios.post(API_URL, body, { headers })
        const data = response.data

        this.messages.push({ type: 'bot', text: data.choices[0].message.content.trim() })
        await this.$nextTick()
        this.scrollparaabajo()
      } catch (error) {
        console.error('API Error:', error)
        this.messages.push({
          type: 'bot',
          text: 'Error al procesar la respuesta. Inténtalo de nuevo.'
        })
        await this.$nextTick()
        this.scrollparaabajo()
      }
    },
    adjustarTextarea(event) {
      const textarea = event.target
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    },
    scrollparaabajo() {
      const container = this.$refs.chatbox
      container.scrollTop = container.scrollHeight
    },
    openControlArchivos(event) {
      // Prevenir la acción predeterminada del enlace
      event.preventDefault()

      // Abrir una nueva pestaña con el enlace al componente ControlArchivos
      window.open('/controlarchivos', '_blank')
    }
  }
}
</script>
