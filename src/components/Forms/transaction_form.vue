<template>
  <div class="">
    <!-- transaction date -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs5>
        <datecomponent
          :date.sync="transaction.date"
          label="Created Start"
        />
      </v-flex>
    </v-layout>
    <!-- transaction price -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="transaction.price"
          :itemprops="$store.state.api.schemas.transaction.properties.price.items.properties"
          label="Price"
          nodatamessage="No price values added"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-layout
              justify-end
              row
              fill-height
              wrap
            >
              <v-flex xs6>
                <v-text-field
                  v-model="props.newitem.amount"
                  filled
                  label="Numerical Amount"
                  type="number"
                />
              </v-flex>
              <v-flex xs6>
                <autocomp
                  v-model="props.newitem.currency"
                  entity="Descriptor"
                  label="Currency"
                  :multiple="false"
                />
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- transaction actor -->
    <v-layout
      justify-end
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="transaction.actor"
          :itemprops="$store.state.api.schemas.transaction.properties.actor.items.properties"
          label="Actor"
          nodatamessage="No actors specified added"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-layout
              justify-end
              row
              fill-height
              wrap
            >
              <v-flex xs6>
                <autocomp
                  v-model="props.newitem.role"
                  entity="Descriptor"
                  filter="ROLE"
                  label="Role"
                  :multiple="false"
                />
              </v-flex>
              <v-flex xs6>
                <autocomp
                  v-model="props.newitem.id"
                  entity="Actor"
                  label="Actor"
                  :multiple="false"
                />
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="props.newitem.note"
                  height="200"
                  filled
                  label="Note"
                />
              </v-flex>
            </v-layout>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
    <!-- transaction comments -->
    <v-layout
      justify-start
      row
      fill-height
    >
      <v-flex xs12>
        <formlistcomponent
          :items.sync="transaction.comments"
          label="Comments"
          nodatamessage="No comments added"
        >
          <template
            slot="form"
            slot-scope="props"
          >
            <v-flex xs5>
              <v-textarea
                v-model="props.newitem.textval"
                height="200"
                label="New Comment"
              />
            </v-flex>
          </template>
        </formlistcomponent>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import autocomp from '../AutoCompleteComponents/Autocomp';
import formlistcomponent from '../FormComponents/FormListComponent';
import datecomponent from '../FormComponents/DateComponent';
/* eslint no-unused-vars: ["error", {"args": "none"}] */
export default {
  components: {
    autocomp,
    formlistcomponent,
    datecomponent,
  },
  props: [
    'value',
  ],
  data() {
    return {
      transaction: {},
      title: '',
      description: '',
      comment: '',
      public: false,
      url: '',
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.transaction = val;
        this.initVals();
      },
    },
    transaction: {
      deep: true,
      immediate: true,
      handler() {
        this.returnObject();
      },
    },
  },
  mounted() {
    this.initVals();
    this.returnObject();
  },
  methods: {
    returnObject() {
      this.$emit('input', this.transaction);
    },
    parseDate(datestring) {
      return new Date(datestring);
    },
    initVals() {
      if (this.value) this.transaction = Object.assign(this.value, this.transaction);
      else this.transaction = {};
      if (!this.transaction.price) {
        this.$set(this.transaction, 'price', []);
      }
      if (!this.transaction.actor) {
        this.$set(this.transaction, 'actor', []);
      }
      if (!this.transaction.comments) {
        this.$set(this.transaction, 'comments', []);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
