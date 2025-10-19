import { defineStore } from 'pinia'
import { db, auth } from '@/firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    loadingUser: true,
  }),
  actions: {
    setUser(user) {
      this.currentUser = user
    },
    async fetchUserProfile(uid) {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const userData = { userId: uid, ...userDoc.data() }
        this.setUser(userData)
      } else {
        this.setUser(null)
      }
    },
    initAuthListener() {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await this.fetchUserProfile(user.uid)
        } else {
          this.currentUser = null
        }
        this.loadingUser = false
      })
    },
    async logout() {
      await signOut(auth)
      this.currentUser = null
    },
  },
});