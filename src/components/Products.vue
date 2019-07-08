<template>
  <div>
    <ul class='sorting'>
      <li>Sort By</li>
      <li>
        <el-select @change="sortChanged" v-model="sortValue" placeholder="Sort">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </li>
    </ul>
    <div class="products">
      <el-row :gutter="12">
        <el-col v-for="(p,index) in products" :key="index" :span="8">
            <el-card shadow="always" class="product-item">
              <div class='action'>
                <el-button type="success" @click="navigateToProduct(p)">Edit</el-button>
              </div>
              <div><span class="label">Name: </span> {{ p.name }}</div>
              <div><span class="label">Brand: </span>{{ p.brand }}</div>
              <div style="width:500px">
                <div class="label inline">UPC12: </div>
                <div class="inline">{{ p.upc12 }}</div>
              </div>
            </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';

export default {
  name: 'Products',
  props: {
    products: { type: Array, required: false }
  },
  data: function() {
    return {
      options: [{
        value: 0,
        label: 'Brand (A-Z)'
      }, {
        value: 1,
        label: 'Brand (Z-A)'
      }, {
        value: 2,
        label: 'Product Name (A-Z)'
      }, {
        value: 3,
        label: 'Product Name (Z-A)'
      }],
      sortValue: 2
    }
  },
  created: function() {
  },

  methods: {
    sortChanged: async function(){
      let result
      try{
        switch(this.sortValue){
          case 0:
            this.products = _.orderBy(this.products, ['brand'], ['asc'])
            break;
          case 1:
            this.products = _.orderBy(this.products, ['brand'], ['desc'])
            break;
          case 2:
            this.products = _.orderBy(this.products, ['name'], ['asc'])
            break;
          case 3:
            this.products = _.orderBy(this.products, ['name'], ['desc'])
            break;
        }

      }catch(err){
        console.log('sort data from api failed: ', err);
      }
    },
    navigateToProduct: function(product){
      window.localStorage.setItem(`product-${product._id}`, JSON.stringify(product));
      this.$router.push(`/edit/product/${product._id}`);
    }
  }
}
</script>

<style lang="scss" scoped>
  .sorting li {
    list-style:none;
    display:inline-block;
    margin-right: 10px;
  }
  .product-item{
    margin-top: 15px;
    position:relative;
    .action{
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .label{
      color: grey;
    }
  }
  .inline {
    display:inline-block;
  }
</style>

