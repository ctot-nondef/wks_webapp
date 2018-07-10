<template lang="html">
  <div>
      <storedialog></storedialog>
  </div>
</template>

<script>
import storedialog from './StoreDialog';



export default {
  components: {
    storedialog,    // directly opens itself. -> old session restore
  },
};
</script>

<style lang="css">
</style>
