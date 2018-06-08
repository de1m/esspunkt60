<template>
  <div class="main">
    <header-nav></header-nav>
    <div class="uk-container uk-container-center uk-container-expand">
      <div class="uk-grid uk-align-center uk-text-center">
        <div class="uk-width-auto">
          <vk-button size="large" type="primary" :disabled="!userAuth" v-on:click="showNewEatPointDialog"><vk-icon icon="plus" ratio="2"></vk-icon></vk-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import { EventBus } from '../ressources/event-bus.js'

export default {
  name: 'Main',
  data: function () {
    return {
      userAuth: ''
    }
  },
  components: {
    'header-nav': Header
  },
  methods: {
    showNewEatPointDialog () {
      this.$router.push('/newpoint')
    }
  },
  beforeMount () {
    let self = this
    EventBus.$on('eventbus-send-auth', authState => {
      self.userAuth = authState
    })
    // var self = this
  }
}
</script>
