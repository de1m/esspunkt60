<template>
  <div class="settings">
    <header-nav></header-nav>
    <div class="uk-container uk-container-central">
      <div class="uk-grid uk-align-center">
        <div class="uk-width-auto">
          <h1 class="uk-heading-line uk-text-center"><span v-bind:data="settingsName"> {{ settingsName }}</span></h1>
          <h3 class="uk-heading-line uk-text-center"><span v-bind:data="userNameL"> {{ userNameL }}</span></h3>
          <div class="uk-width-1-1 uk-text-center">
            <p v-bind:data="userDeleteques"> {{ userDeleteques }} </p>
            <vk-button v-bind:type="userSaveButtType" v-on:click="deleteUser" :disabled="disableDelUserBtn"> JA </vk-button>
          </div>
          <h3 class="uk-heading-line uk-text-center"><span v-bind:data="eatPointL"> {{ eatPointL }}</span></h3>
        </div>
      </div>
      <div class="uk-grid">
        <div class="uk-width-2-3"></div>
        <div class="uk-width-auto uk-align-right">
          <vk-button-link href='#/'>Zurück</vk-button-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Header from '@/components/Header'

export default {
  name: 'Setting',

  data: function () {
    return {
      settingsName: 'Einstellungen',
      userNameL: 'Benutzer',
      eatPointL: 'Esspunkt',
      userDeleteques: 'Sollte der Benutzer gelöscht werden?',
      userSaveButtType: 'primary',
      userDeletePromt: 0,
      deleteLast: false,
      disableDelUserBtn: false
    }
  },
  components: {
    'header-nav': Header
  },
  bevoreMount () {
  },
  methods: {
    deleteUser () {
      let self = this
      let userFromCookie = this.$cookie.get('USER_NAME')
      if (this.userDeletePromt === 0) {
        this.userDeleteques = 'Sicher?'
        this.userSaveButtType = 'secondary'
      }

      if (this.userDeletePromt === 1) {
        this.userDeleteques = 'Ganz sicher?! Jetzt wird der Benutzer tatsächlich gelöscht'
        this.userSaveButtType = 'danger'
        this.deleteLast = true
      }

      if (this.userDeletePromt === 2) {
        this.$socket.emit('user_delete_data', {
          username: userFromCookie,
          fprint: this.$store.state.fingerprint
        })
        this.disableDelUserBtn = true
      }

      this.$socket.on('user_delete_data_back', function (userDelData) {
        if (userDelData.err === false) {
          self.userDeletePromt = 0
          self.$cookie.delete('SESSION_ID')
          self.$cookie.delete('USER_NAME')
          self.$router.push('/')
        } else {

        }
      })

      this.userDeletePromt++
    }
  }
}
</script>
