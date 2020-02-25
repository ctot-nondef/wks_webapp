<template>
  <detailswrapper :id="$route.params.id"  :type="$route.params.type" :key="componentKey"></detailswrapper>
</template>
<script>
  import detailswrapper from "./ViewComponents/detailswrapper";

  export default {
    components: {
      detailswrapper,
    },
    data() {
      return {
        componentKey: 0,
      };
    },
    methods: {
      forceRerender() {
        this.componentKey += 1;
      }
    },
    watch: {
      '$route.params.id': function () {
        this.forceRerender();
      },
    },
  };
</script>