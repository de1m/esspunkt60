<template>
  <div class="info">
    <header-nav></header-nav>
    <div class="uk-container uk-container-center uk-container-expand">
      <div class="uk-grid uk-align-center uk-text-center">
        <div class="uk-width-auto">
          <h3> INFO: Noch nichts drin </h3>
          <!-- <vk-button-link href='#/'>Zurück</vk-button-link> -->
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
