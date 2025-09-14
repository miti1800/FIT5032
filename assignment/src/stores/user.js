import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
  }),
  actions: {
    setUser(user) {
      this.currentUser = user
    },
    logout() {
      this.currentUser = null
    },
  },
});