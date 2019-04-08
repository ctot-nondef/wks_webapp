<template lang="html">
  <div>
      <logindialog></logindialog>
      <logoutdialog></logoutdialog>
  </div>
</template>

<script>
import logindialog from './LoginDialog';
import logoutdialog from './LogoutDialog';

export default {
  components: {
    logindialog,
    logoutdialog,
  },
};
</script>

<style lang="css">
</style>
