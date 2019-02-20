<template>
<div>
    <v-autocomplete
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      v-model="select"
      :label="label"
      flat
      item-text="name"
      item-value="_id"
      cache-items
      return-object
      @input="$emit('input', select)"
      :multiple="multiple"
      :append-outer-icon="icon"
      @click:append-outer="runfunc"
      >
    <template slot="selection" slot-scope="data">
        <template v-if="multiple">
          <v-chip :selected="data.selected" close class="chip--select-multi" @input="remove(data.item)" color="white">
            {{ data.item.name }} 
          </v-chip>
        </template>
        <template v-else>   
         {{ data.item.name }}
        </template>
      </template>
      <template slot="item" slot-scope="data">
        <template v-if="typeof data.item !== 'object'">
          <v-list-tile-content v-text="data.item"></v-list-tile-content>
        </template>
        <template v-else>
          <v-list-tile-content>
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
          </v-list-tile-content>
        </template>
      </template>
    </v-autocomplete></div>
</template>

<script>
import { mapActions } from 'vuex';
import HELPERS from '../../helpers';

export default {
  mixins: [HELPERS],
  props: [
    'value',
    'label',
    'multiple',
    'filter',
    'icon',
    'clickevent'
  ],
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: [] || ''
    };
  },
  watch: {
    search(newval, oldval) {
      if(newval) {
        this.querySelections(newval);
      }
    },
    value(val) {
      if (this.multiple === true) {
        this.select = val;
        this.items = val;
      } 
    },
  },

  methods: {
    runfunc(func) {
      if (this.clickevent) {
        this.clickevent();
      }
    },
    querySelections() {
      this.loading = true;
      // this.$info(vm);
     const filterval = this.filterDescriptors(this.filter); 
      this.get({
        type: 'descriptor',
        query: JSON.stringify({
          name: {"$regex": this.search || '' },
          instanceOf: filterval,
        })
      })
      .then((res) => {
        if (Array.isArray(res.data)) this.items = res.data;
        this.loading = false;
      })
      .catch((res) => {
        this.$debug(res);
        this.loading = false;
      });
    },
    ...mapActions('api', [
      'get',
    ]),
    filterDescriptors(descriptortype) {
      switch (descriptortype) {
        case 'ACQMETH':
        return '5be884e8add30d031e41bc27'
        break;
        case 'ACTIV':
        return '5be884e8add30d031e41bc15'
        break;
        case 'ASSOC':
        return '5be884e8add30d031e41bc0c'
        break;
        case 'COLL':
        return '5be884e8add30d031e41bc24'
        break;
        case 'COND':
        return '5be884e8add30d031e41bc23'
        break;
        case 'COUNTRY':
        return '5be884e8add30d031e41bc13'
        break;
        case 'DIM':
        return '5be884e8add30d031e41bc0a'
        break;
        case 'DOCTYPE':
        return '5be884e8add30d031e41bc0d'
        break;
        case 'EVENT':
        return '5be884e8add30d031e41bc12'
        break;
        case 'GEOKEYW':
        return '5be884e8add30d031e41bc10'
        break;
        case 'Geographie':
        return '5be884e8add30d031e41bc20'
        break;
        case 'INSCTYPE':
        return '5be884e8add30d031e41bc0b'
        break;
        case 'KEYWORD':
        return '5be884e8add30d031e41bc17'
        break;
        case 'LANGUAGE':
        return '5be884e8add30d031e41bc0f'
        break;
        case 'LOANCAT':
        return '5be884e8add30d031e41bc28'
        break;
        case 'LOCATION':
        return '5be884e8add30d031e41bc29'
        break;
        case 'MATER':
        return '5be884e8add30d031e41bc1e'
        break;
        case 'MOTIF':
        return '5be884e8add30d031e41bc26'
        break;
        case 'NATIONALITY':
        return '5be884e8add30d031e41bc0e'
        break;
        case 'OBJCAT':
        return '5be884e8add30d031e41bc25'
        break;
        case 'OBJECT':
        return '5be884e8add30d031e41bc16'
        break;
        case 'OCCUPATION':
        return '5be884e8add30d031e41bc1b'
        break;
        case 'PERIOD':
        return '5be884e8add30d031e41bc19'
        break;
        case 'PLACE':
        return '5be884e8add30d031e41bc1a'
        break;
        case 'POSITION':
        return '5be884e8add30d031e41bc1f'
        break;
        case 'PROPNAME':
        return '5be884e8add30d031e41bc2a'
        break;
        case 'REPRO_TYPE':
        return '5be884e8add30d031e41bc0e'
        break;
        case 'RIGHTS':
        return '5be884e8add30d031e41bc21'
        break;
        case 'ROLE':
        return '5be884e8add30d031e41bc09'
        break;
        case 'SCHOOL':
        return '5be884e8add30d031e41bc22'
        break;
        case 'SCRIPT':
        return '5be884e8add30d031e41bc11'
        break;
        case 'SUBJECT':
        return '5be884e8add30d031e41bc14'
        break;
        case 'TECHN':
        return '5be884e8add30d031e41bc1c'
        break;
        case 'UNIT':
        return '5be884e8add30d031e41bc18'
        break;
      }
    },
    remove (item) {
       const index = this.select.findIndex(r => r._id === item._id);
       if (index >= 0) this.select.splice(index, 1);
       this.$emit('input', this.select);
     }
  },
  created() {

  },
};
</script>
