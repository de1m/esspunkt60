<template>
  <div class="about">
    <app-header></app-header>
    <p v-bind:data="dtext">
        {{ dtext }}
    </p>
    <a href="/">Main</a>
    <br />
    <vk-button v-on:click="greet">Button Test</vk-button>
  </div>
</template>

<script>
import Hello from '@/components/Main'
export default {
  name: 'About',
  components: {
    'app-header': Hello
  },
  data: function () {
    return {
      dtext: 'Das ist ein button Text'
    }
  },
  methods: {
    greet: function (event) {
      this.dtext = 'Text wurde geändert'
    }
  }
}
</script>
