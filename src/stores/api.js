import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('api', {
  state: () => {
    return {
      url: import.meta.env.API_URL,
      user: undefined,
      token: undefined,
      data: undefined,
      authError: null,
    }
  },
  getters: {
    authorized() { return !(!this.token) }
  },
  actions: {
    init() {
      //try to get user from URL or cookie
      let user = new URLSearchParams(window.location.search).get('user')
      if (!user) {
        console.log(user)
        userCookie = document.cookie.split(';').find(c => c.trim().startsWith('userId='))
        if (userCookie) user = userCookie.split('=')[1]
        if (user) console.log("found userID in cookies: "+user)
      }
      this.user = user

      //try to get token from cookie
      this.token = getCookie('token')
    },
    async login(passwd) {
      try {
        const response = await fetch(this.url+'/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user: this.user, password: passwd }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          if (data.token) {
            // Set token as a cookie
            document.cookie = `token=${data.token}; path=/`;
            document.cookie = `userId=${user}; path=/; age=604800`

            this.token = data.token
            this.authError = null

          } else {
            this.authError = 'Invalid response: No token received';
          }
        } else {
          if (response.status == 401) {
              const data = await response.json()
              console.log(data)
              let attempts = data.attemptsLeft

              if (attempts == 0) {
                  this.authError = "Wrong PIN, an account has been blocked"
              } else if (attempts > 0) {
                  this.authError = `Wrong PIN, ${attempts} attempts left`
              } else {
                  'Unauthorized'
              }
          } else {
              this.authError = 'Failed to login: ' + response.statusText;
          }
        }
      } catch (error) {
        this.authError = 'Error: ' + error.message;
      }
    }


  }
})

