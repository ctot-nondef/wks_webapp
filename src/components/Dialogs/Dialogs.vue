<template lang="html">
  <div>
      <logindialog></logindialog>
      <logoutdialog></logoutdialog>
      <createdialog></createdialog>
  </div>
</template>

<script>
import logindialog from './LoginDialog';
import logoutdialog from './LogoutDialog';
import createdialog from './CreateDialog';

export default {
  components: {
    logindialog,
    logoutdialog,
    createdialog,
  },
};
</script>

<style lang="css">
</style>
