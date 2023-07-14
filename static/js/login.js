const app = Vue.createApp({
  data() {
    return {
      url_api: 'http://localhost:5000',
      usuario: '',
      clave: '',
      logueado: false,
    };
  },
  methods: {
    async iniciarSesion() {
      try {
        const payload = {
          usuario: this.usuario,
          clave: this.clave,
        };
        console.log('Request Payload:', payload);
        
        const response = await fetch(`${this.url_api}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.token) {
            const token = data.token;
            localStorage.setItem('token', token);
            console.log('Usuario autenticado, token:', token);
            this.logueado = true;
            window.location.href = 'alumnos2.html';
          } else {
            console.log('Credenciales inválidas');
          }
        } else {
          console.log('Error en la solicitud:', response.status);
        }
      } catch (error) {
        console.error('Ocurrió un error al realizar la solicitud HTTP', error);
      }
    },
    salir() {
      localStorage.removeItem('token');
      this.logueado = false;
    },
  },
  created() {
    const token = localStorage.getItem('token');
    this.logueado = token !== null;
  },
});

app.mount('#app');

