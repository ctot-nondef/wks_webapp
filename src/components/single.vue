<template>
  <detailswrapper
    :id="$route.params.id"
    :key="componentKey"
    :type="$route.params.type"
  />
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
    watch: {
      '$route.params.id': function () {
        this.forceRerender();
      },
    },
    methods: {
      forceRerender() {
        this.componentKey += 1;
      }
    },
  };
</script>