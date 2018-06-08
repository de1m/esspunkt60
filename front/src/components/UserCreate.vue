<template>
  <div class='user'>
  <header-nav></header-nav>
  <div class="uk-container uk-container-central uk-text-center">
    <h1 v-bind:data='headerText'>
      {{ headerText }}
    </h1>
    <div class="uk-grid">
      <div class="uk-width-1-1">
        <div class="uk-margin">
          <input class="uk-input uk-form-width-medium" type="text" v-bind:placeholder="placeholderData" v-model="userNameFromInput" v-on:keyup.enter="saveUser">
        </div>
      </div>
      <div class="uk-width-1-1 uk-align-center">
        <p v-if='showErrText' v-bind:data='errorText' style="color: red"> <vk-icon icon="warning"></vk-icon> {{ errorText}} </p>
      </div>
      <div class="uk-width-1-1">
        <vk-button type='primary' v-on:click="saveUser">Speichern</vk-button>
        <vk-button-link href='#/'>Abbrechen</vk-button-link>
      </div>
      <div class="uk-card uk-card-default uk-card-body uk-width-1-4 uk-align-center">
        <h3 class="uk-card-title" v-bind:data="userNameRuleDesc">{{ userNameRuleDesc }}</h3>
        <ul class="uk-list uk-text-left">
          <li v-for="(item, index) in userNameRuleExam" :key="item.id">
            {{ index + 1}}. - {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'CreateUser',
  components: {
    'header-nav': Header
  },
  data: function () {
    return {
      headerText: 'Neuer Benutzer',
      placeholderData: 'Neuer Benutzer',
      userNameFromInput: '',
      showErrText: false,
      errorText: 'Benutzername sollte eine von den drei Formen verwenden',
      userNameRuleDesc: 'Benutzerbennenungsregeln:',
      userNameRuleExam: ['v.name', 'Vorname Name', 'Vorname Vorname Name'],
      userInfo: ''
    }
  },
  methods: {
    saveUser () {
      let self = this
      let regexpPunkt = /^[a-zA-Z]{1}\.+[a-zA-z]+$/g
      let regexpTwo = /^[a-zA-Z]+\s{1}[a-zA-Z]+$/g
      let regexpThree = /^[a-zA-Z]+\s{1}[a-zA-Z]+\s{1}[a-zA-Z]+$/g
      if (self.userNameFromInput.match(regexpPunkt) != null || self.userNameFromInput.match(regexpTwo) != null || self.userNameFromInput.match(regexpThree) != null) {
        self.showErrText = false
        self.$store.dispatch('setFingerPrint').then(() => {
          this.$socket.emit('user_login_create', {
            username: self.userNameFromInput,
            fprint: self.$store.state.fingerprint
          })
        })
      } else {
        self.showErrText = true
      }
      this.$socket.on('userBackDataCreate', function (userBackData) {
        if (userBackData.auth) {
          self.userColored = 'primary'
          self.notUserExist = false
          self.$cookie.set('SESSION_ID', userBackData.hash, 10)
          self.$cookie.set('USER_NAME', userBackData.username)
          self.userInfo = userBackData
          self.$router.push({path: '/'})
        }
      })
    }
  }
}
</script>
