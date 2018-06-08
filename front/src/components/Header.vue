<template>
  <div class="header">
    <div class="uk-container uk-container-center uk-container-expand">
      <div class="uk-grid">
        <div class="uk-width-auto uk-align-left">
          <h1 class="class-text-logo uk-heading-primary"><a href="#/" class="uk-link-reset">Esspunkt60</a></h1>
          <div class="class-slog uk-text-lead"> Sammelpunkt für die Hungrigen </div>
        </div>
        <div class="uk-width-2-3 uk-text-right">
          <vk-button size="large" type="primary" style="margin-bottom:0.4em; line-height: 27px;" disabled v-bind:data="userNameFromDB" v-if="!notUserExist">
          <vk-icon icon="user" ratio="1"> </vk-icon>
          <vk-icon icon="star" ratio="1" style="color: gold" v-for="t in sGold" :key="t.id"> {{ t }} </vk-icon>
          <vk-icon icon="star" ratio="0.7" style="color: silver" v-for="t in sSilver" :key="t.id"> {{ t }} </vk-icon>
          <vk-icon icon="star" ratio="0.5" style="color: orange" v-for="t in sBronze" :key="t.id"> {{ t }} </vk-icon>
          <vk-icon icon="chevron-up" ratio="0.7" style="color: gold" v-for="t in wsGold" :key="t.id"> {{ t }} </vk-icon>
          <vk-icon icon="chevron-up" ratio="0.5" style="color: silver" v-for="t in wsSilver" :key="t.id"> {{ t }} </vk-icon>
          <vk-icon icon="chevron-up" ratio="0.3" style="color: orange" v-for="t in wsBronze" :key="t.id"> {{ t }} </vk-icon>
          <br />
          {{ userNameFromDB }}
          </vk-button>
          <vk-button-link v-if="notUserExist" href="#/newuser" size="small" v-bind:type="userColored"> <vk-icon icon="user"></vk-icon> </vk-button-link>
          <vk-button-link href="#/settings" size="small" v-if="!notUserExist"> <vk-icon icon="settings"></vk-icon> </vk-button-link>
          <vk-button-link size="small" href="#/info"> <vk-icon icon="info"></vk-icon> </vk-button-link>
          <p v-bind:data="UserNotAuthText" v-if="notUserExist" style="color: red"> {{ UserNotAuthText }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import { mapState } from 'vuex'
import { EventBus } from '../ressources/event-bus.js'

export default {
  name: 'Header',
  data: function () {
    return {
      UserNotAuthText: 'Noch nicht angemeldet',
      userColored: 'danger',
      notUserExist: true,
      userNameFromDB: '',
      sGold: '',
      sSilver: '',
      sBronze: '',
      wsGold: '',
      wsSilver: '',
      wsBronze: ''
    }
  },
  components: {

  },
  // computed: mapState({
  // }),
  methods: {
  },
  beforeMount () {
    let self = this
    // let hashFromCookie = this.$cookie.get('SESSION_ID')
    let userFromCookie = this.$cookie.get('USER_NAME')
    // if (hashFromCookie !== null) {
    this.$store.dispatch('setFingerPrint').then(() => {
      self.$socket.emit('user_login_data', {
        username: userFromCookie,
        fprint: self.$store.state.fingerprint
      })
    })
    // }

    var callStars = function (stars) {
      let gS = 60 // gold
      let sS = 30 // silver
      let bS = 15 // bronze
      let wsG = 10 // gold shewron
      let wsS = 5 // silver shewron
      // let wbS = 1 // silver shewron
      let sGoldMod = stars % gS
      let sGold = (stars - sGoldMod) / gS
      let sSilverMod = (stars - (sGold * gS)) % sS
      let sSilver = (stars - (sGold * gS) - (sSilverMod)) / sS
      let sBronzeMod = (stars - (sGold * gS) - (sSilver * sS)) % bS
      let sBronze = (stars - (sGold * gS) - (sSilver * sS) - (sBronzeMod)) / bS
      let wsGoldMod = (stars - (sGold * gS) - (sSilver * sS) - (sBronze * bS)) % wsG
      let wsGold = (stars - (sGold * gS) - (sSilver * sS) - (sBronze * bS) - wsGoldMod) / wsG
      let wsSilverMod = (stars - (sGold * gS) - (sSilver * sS) - (sBronze * bS) - (wsGold * wsG)) % wsS
      let wsSilver = (stars - (sGold * gS) - (sSilver * sS) - (sBronze * bS) - (wsGold * wsG) - wsSilverMod) / wsS
      let wsBronze = (stars - (sGold * gS) - (sSilver * sS) - (sBronze * bS) - (wsGold * wsG) - (wsSilver * wsS))

      self.sGold = sGold
      self.sSilver = sSilver
      self.sBronze = sBronze
      self.wsGold = wsGold
      self.wsSilver = wsSilver
      self.wsBronze = wsBronze
    }

    self.$socket.on('userBackData', function (userInfo) {
      // console.log('userBackData', userInfo)
      if (userInfo.auth === true && userInfo.err === false) {
        self.userNameFromDB = userInfo.username
        self.notUserExist = false
        callStars(userInfo.stars)
        EventBus.$emit('eventbus-send-auth', true)
      } else {
        console.log('User authentication not ok')
        if (self.$route.path === '/newuser' || self.$route.path === '/info' || self.$route.path === '/neweatp') {
        } else {
          self.notUserExist = true
          self.$router.push('/')
        }
      }
    })
  }
}
</script>

<style>
  .class-slog {
    color:#901c1c42;
    margin-top: -15px;
    font-size: 15px;
  }
  .class-text-logo {
    color: #3b92f1;
    margin-bottom:0;
    padding-bottom:0;
  }
</style>
