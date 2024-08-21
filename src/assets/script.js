document.addEventListener('DOMContentLoaded', function () {
  const chatbox = document.querySelector('.chatbox')
  const chatInput = document.querySelector('.chat-input textarea')

  const chatbotToggler = document.querySelector('.chatbot-toggler')
  const closeBtn = document.querySelector('.close-btn')

  const sendChatBtn = document.querySelector('.chat-input span')

  let mensajeUsuario = null // Variable para almacenar el mensaje del usuario
  const API_KEY = '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' // Pega tu clave API aquí
  const alturaInicialInput = chatInput.scrollHeight
  const crearChatLi = (mensaje, className) => {
    // Crear un elemento <li> para el chat con el mensaje pasado y className
    const chatLi = document.createElement('li')
    chatLi.classList.add('chat', `${className}`)
    let contenidoChat =
      className === 'outgoing'
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = contenidoChat
    chatLi.querySelector('p').textContent = mensaje
    return chatLi // devuelve el elemento <li> para el chat
  }
  const generarRespuesta = (elementoChat) => {
    const API_URL = 'https://api.openai.com/v1/chat/completions'
    const elementoMensaje = elementoChat.querySelector('p')
    // Definir las propiedades y el mensaje para la solicitud API
    const opcionesDeSolicitud = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: mensajeUsuario }]
      })
    }
    // Enviar solicitud POST a la API, obtener respuesta y configurar el texto del párrafo como respuesta
    fetch(API_URL, opcionesDeSolicitud)
      .then((res) => res.json())
      .then((data) => {
        elementoMensaje.textContent = data.choices[0].message.content.trim()
      })
      .catch(() => {
        elementoMensaje.classList.add('error')
        elementoMensaje.textContent = 'Parece que ha habido un error, inténtalo de nuevo'
      })
      .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight))
  }
  const manejarChat = () => {
    mensajeUsuario = chatInput.value.trim() // Obtener el mensaje ingresado por el usuario y eliminar espacios extras
    if (!mensajeUsuario) return
    // Limpiar el área de texto de entrada y establecer su altura a la predeterminada
    chatInput.value = ''
    chatInput.style.height = `${alturaInicialInput}px`
    // Añadir el mensaje del usuario al chatbox
    chatbox.appendChild(crearChatLi(mensajeUsuario, 'outgoing'))
    chatbox.scrollTo(0, chatbox.scrollHeight)

    setTimeout(() => {
      // Mostrar mensaje "Pensando..." mientras se espera la respuesta
      const chatLiEntrante = crearChatLi('Pensando...', 'incoming')
      chatbox.appendChild(chatLiEntrante)
      chatbox.scrollTo(0, chatbox.scrollHeight)
      generarRespuesta(chatLiEntrante)
    }, 600)
  }
  chatInput.addEventListener('input', () => {
    // Ajustar la altura del área de texto de entrada basada en su contenido
    chatInput.style.height = `${alturaInicialInput}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
  })
  chatInput.addEventListener('keydown', (e) => {
    // si precionas enter mas el shift se va para abajo
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      manejarChat()
    }
  })

  sendChatBtn.addEventListener('click', manejarChat)
  closeBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'))
  chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'))
})
