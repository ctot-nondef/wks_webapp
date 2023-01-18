<template>
  <div class="">
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs6>
        <v-text-field
          v-model="user.firstName"
          label="First Name"
          @input="returnObject()"
        />
      </v-flex>
      <v-flex xs6>
        <v-text-field
          v-model="user.lastName"
          label="Last Name"
          @input="returnObject()"
        />
      </v-flex>
    </v-layout>
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs6>
        <v-text-field
          v-model="user.email"
          label="Email"
          @input="returnObject()"
        />
      </v-flex>
      <v-flex xs6>
        <v-text-field
          v-model="user.password"
          label="Password"
          :append-icon="showPwd ? 'visibility' : 'visibility_off'"
          :rules="[rules.required, rules.min]"
          :type="showPwd ? 'text' : 'password'"
          hint="At least 8 characters"
          counter
          @input="returnObject()"
          @click:append="showPwd = !showPwd"
        />
      </v-flex>
    </v-layout>
  </div>
</template>
<script>

/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
  },
  props: [
    'value',
  ],
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
      },
      showPwd: false,
    };
  },
  watch: {
    value(val) {
      // eslint-disable-next-line no-param-reassign
      if (!val.password) val.password = '';
      this.user = val;
    },
  },
  created() {
  },
  methods: {
    returnObject() {
      this.$emit('input', this.user);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
