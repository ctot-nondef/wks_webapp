<template>
  <div class="">
    <v-container>
      <v-row align="start">
        <v-col>
          <span>{{ statusnote }}</span>
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col cols="12" sm="4">
          <v-text-field v-model="password" type="password" label="Password"/>
        </v-col>
        <v-col cols="12" sm="4">
          <v-btn @click="reset" large color="primary" :disabled="!verified">
            RESET PASSWORD
          </v-btn>
        </v-col>
        <v-col></v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';

export default {
  components: {
  },
  name: 'resetPassword',
  data() {
    return {
      email: "",
      password: "",
      verified: false,
      statusnote: "Verifying Link Token",
    };
  },
  computed: {
    ...mapGetters('api', [
      'getClient',
    ]),
  },
  methods: {
    ...mapMutations('dialogs', [
      'openDialog',
    ]),
    reset() {
      this.getClient.User.UserController_resetPassword(
          null,
          {
            requestBody: {
              email: this.email,
              password: this.password,
            }
          }
      )
      .then(() => {
        this.$router.push({ path: "/en/start" });
        this.openDialog('loginDialog');
      })
      .catch((res) => {
        if(res.body && res.body.statusCode == "500") this.statusnote = "Please make sure your password is at least 5 characters long."
      })
    },
  },
  created() {
    if(this.$route.params.token) {
      this.getClient.User.UserController_forgotPasswordVerify(
          null,
          {
            requestBody: {
              "verification": this.$route.params.token,
            },
          },
      )
      .then((res) => {
        this.email = res.body.email;
        this.verified = true;
        this.statusnote = "Link Token successfully verified. Now reset your password:"
      })
      .catch(() => {
        this.statusnote = "Link Token invalid."
      })
    }
    else {
      this.statusnote = "Link Token invalid."
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
