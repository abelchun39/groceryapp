<template>
  <div class="page page--index">
    <h1 style="text-align:center">Grocery App</h1>
    <div style="text-align: center">
      <el-input placeholder="Type Brand or Product Name" v-model="search" class="input-with-select">
        <el-select v-model="selectOption" slot="prepend" placeholder="Select" style="width:140px;">
          <el-option label="All" value="1,2"></el-option>
          <el-option label="Brand" value="1"></el-option>
          <el-option label="Product Name" value="2"></el-option>
        </el-select>
        <el-button @click="Search()" slot="append" icon="el-icon-search">Search</el-button>
      </el-input>
    </div>
    <div>
      <h2>{{ (isSearch) ? 'Search Results' : 'List Products' }}</h2>
      <h3 v-if="products && products.length === 0">Search result is empty</h3>
      <products v-if="products && products.length > 0" :products="products"></products>
    </div>
  </div>
</template>

<script>
import Products from './../components/Products.vue';
import axios from 'axios';
import _ from 'lodash';

export default {
  components: {
    Products
  },
  data: function() {
    return {
      isSearch: false,
      selectOption: '1,2',
      search: null,
      products: []
    }
  },
  async created(){
    // Load Projects from DB
    let result
    try{
      result = await axios.get(`${process.env.SERVER_HOST}/products`);
      if(result && result.data){
        this.products = result.data;
      }
    }catch(err){
      console.log('Failed to retrieve data: ', err)
    }
  },
  methods: {
    Search: async function(){
      // Call API search with this.select parameter
        let result
        try {
          result = await axios.post(`${process.env.SERVER_HOST}/products/search`, { 
            term: this.search, 
            option: this.selectOption 
          });
          if(result && result.data){
            if(result.data.length >= 0){
              this.products = result.data;
            }
          }
        }catch(err){
          console.log('Failed to search: ', err);
          this.$swal('Ops!', `Failed to search ${err}`,'error')
        }
      
    }
  }
}
</script>

<style lang='scss' scoped>
.input-with-select{
  width: 500px;
  margin: 0 auto;
}
</style>