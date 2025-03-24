import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { api_url } from './apiUrl';

function getCookie(name) {
  const cookies = document.cookie.split(';'); // Split into individual cookies
  for (let cookie of cookies) {
      cookie = cookie.trim(); // Remove leading/trailing whitespace
      if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1); // Return the value of the cookie
      }
  }
  return null; // Return null if not found
}

export const useStore = defineStore('api', {
  state: () => {
    return {
      url: api_url,
      user: undefined,
      token: undefined,
      data: undefined,
      apiError: null,
    }
  },
  getters: {
    authorized() { return !(!this.token) }
  },
  actions: {
    init() {
      console.log(this.url)
      //try to get user from URL or cookie
      let user = new URLSearchParams(window.location.search).get('user')
      if (!user) {
        const userCookie = document.cookie.split(';').find(c => c.trim().startsWith('userId='))
        if (userCookie) user = userCookie.split('=')[1]
        if (user) console.log("found userID in cookies: "+user)
      }
      console.log(user)
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
            this.apiError = null

          } else {
            this.apiError = 'Invalid response: No token received';
          }
        } else {
          if (response.status == 401) {
              const data = await response.json()
              console.log(data)
              let attempts = data.attemptsLeft

              if (attempts == 0) {
                  this.apiError = "Wrong PIN, an account has been blocked"
              } else if (attempts > 0) {
                  this.apiError = `Wrong PIN, ${attempts} attempts left`
              } else {
                  'Unauthorized'
              }
          } else {
              this.apiError = 'Failed to login: ' + response.statusText;
          }
        }
      } catch (error) {
        this.apiError = 'Error: ' + error.message;
      }
    },
    async sendApiRequest(endpoint) {
      const apiUrl = `${this.url}/${endpoint}`
        
        const token = getCookie('token')

        let output = {
            ok: false,
            status: 0,
            data: undefined,
        }
        // Sending a GET request using the fetch API
        try
        {
          response = await fetch(apiUrl, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          })

          if ( response.status >= 200 && response.status < 500 ) {
              if (response.ok) output.data = await response.json()
              output.status = response.status
              output.ok = true
              this.apiError = null
          } else {
            this.apiError = "Connection error: " + respoonse.statusText 
          }

        } catch(error) {
            this.apiError = 'There was a problem with the fetch operation:' + error;
        }

        return output
    },
    async logout() {
      r = this.sendApiRequest('logout')
      if (r.ok && r.status == 200) {
        this.token = undefined
      } 
    }


  }
})

