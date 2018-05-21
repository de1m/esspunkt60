<template>
  <div class="logo">
    <vk-button size="large" type="primary" style="margin-bottom:0.4em"> <vk-icon icon="plus" ratio="2"></vk-icon> </vk-button>
    <br/>
    <vk-button size="small" v-bind:type="userColored"> <vk-icon icon="user"></vk-icon> </vk-button>
    <vk-button size="small" :disabled="notUserExist"> <vk-icon icon="settings"></vk-icon> </vk-button>
    <vk-button size="small" v-on:click="getInfo"> <vk-icon icon="info"></vk-icon> </vk-button>
    <!-- <vk-notification :messages.sync="messages"></vk-notification> -->
  </div>
</template>

<script>
import Fingerprint from 'fingerprintjs2'

export default {
  name: 'Main',
  data: function () {
    return {
      userColored: 'danger',
      notUserExist: true
    }
  },
  methods: {
    getInfo: function (event) {
      // this.$socket.emit('emit_met', 'test')
    }
  },
  beforeMount () {
    var self = this
    this.$cookie.set('userLogin_data', 'de1m')
    let userFromCookie = this.$cookie.get('userLogin_data')
    if (userFromCookie == null) {
    } else {
      Fingerprint().get(function (fprint) {
        self.$socket.emit('user_login_data', {'username': userFromCookie, 'hash': fprint})
      })
    }
    this.$socket.on('userBackData', function (userBackData) {
      if (userBackData.auth && userFromCookie === userBackData.user) {
        console.log('user match')
        self.userColored = 'primary'
        self.notUserExist = false
        // self.messages.push('Test')
      }
    })
  }
}
</script>
