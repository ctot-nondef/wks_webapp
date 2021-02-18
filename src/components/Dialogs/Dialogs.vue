<template lang="html">
  <div>
      <logindialog></logindialog>
      <logoutdialog></logoutdialog>
      <resetdialog></resetdialog>
  </div>
</template>

<script>
import logindialog from './LoginDialog';
import logoutdialog from './LogoutDialog';
import resetdialog from './ResetDialog';

export default {
  components: {
    logindialog,
    logoutdialog,
    resetdialog,
  },
};
</script>

<style lang="css">
</style>
