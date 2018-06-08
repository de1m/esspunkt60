<template>
  <div class="info">
    <header-nav></header-nav>
    <div class="uk-container uk-container-center uk-container-expand">
      <div class="uk-grid uk-align-center uk-text-center">
        <div class="uk-width-auto">
          <h3 class="uk-heading-line uk-text-center"><span v-bind:data="selectNewEatpointText"> {{ selectNewEatpointText }}</span></h3>
          <h3 class="uk-heading-line uk-text-center"><span v-bind:data="createNewEatpointText"> {{ createNewEatpointText }}</span></h3>
          <vk-button v-on:click="goBack">Zurück</vk-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
export default {
  name: 'Info',
  data: function () {
    return {
      selectNewEatpointText: 'Neuen Esspunkt auswählen',
      createNewEatpointText: 'Neuen Esspunkt erstellen'
    }
  },
  components: {
    'header-nav': Header
  },
  methods: {
    goBack: function () {
      this.$router.push('/')
    }
  }
}
</script>
