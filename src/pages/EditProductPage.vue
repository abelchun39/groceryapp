<template>
  <div class="page page--index">
    <h1 style="text-align:center">Edit Product {{ (displayName) ? `(${displayName})` : '' }}</h1>

    <div class="product-container">
      <div class="detail">
        <div class="label">Product Name</div>
        <span v-if="!validate.name" class='error'>Product Name must not be empty!</span>
        <el-input placeholder="Product Name" v-model="product.name"></el-input>
      </div>
      <div class="detail">
        <div class="label">Brand</div>
        <span v-if="!validate.brand" class='error'>Brand must not be empty!</span>
        <el-input placeholder="Brand Name" v-model="product.brand"></el-input>
      </div>
      <div class="detail">
        <div class="label">UPC12 Number</div>
        <span v-if="!validate.upc12" class='error'>UPC12 {{ validate.reason }}</span>
        <el-input placeholder="UPC12 Number" v-model="product.upc12"></el-input>
      </div>

      <div class='action'>
         <el-button @click="back()" type="default">Cancel</el-button>
        <el-button @click="save()" type="success">Save</el-button>`
      </div>
     

    </div>
    
  </div>
</template>

<script>
import Products from './../components/Products.vue';
import axios from 'axios';
import BigNumber from 'bignumber.js';

export default {
  name: "EditProductPage",
  props: {
    id: { type: String, required: true }
  },
  components: {
    Products
  },
  async created(){
    let id = this.$route.params.id;
    this.id = id
    let localData = JSON.parse(window.localStorage.getItem(`product-${id}`));
    if(localData){
      // localData['upc12'] = (new BigNumber(localData['upc12'])).toFixed();
      this.product = localData;
      window.localStorage.removeItem(`product-${id}`);
    }else{
      // Get from DB
      let result
      try{
        result = await axios.get(`${process.env.SERVER_HOST}/product/${id}`);
        if(result && result.data){
          this.product = (result.data) ? result.data : null;
        } 
      }catch(err){
        console.log('Retrieve data from api failed: ', err);
         this.$swal('Ops!', `Failed to retrieve data ${err}`,'error')
      }
    }
    this.displayName = this.product.name;
  },
  data: function() {
    return {
      product: {
        _id: null,
        brand: null,
        name: null,
        upc12: null
      },
      validate:{
        brand: true,
        name: true,
        upc12: true,
        reason: null
      },
      displayName: null
    }
  },
  methods: {
    back: function(){
      this.$router.push('/')
    },
    validateFields: function(){
      const onlyDigits = string => [...string].every(c => '0123456789'.includes(c));
      for(var key in _.omit(this.product,['_id'])){
        let validate = false;
        let value = this.product[key];
        let reason;
        if(!value) validate = false;
        else validate = true;
        if(key === 'upc12'){
          if(!validate) reason = 'must not be empty!';
          if(value && !onlyDigits(value)){
            validate = false;
            reason = 'must only contains number and no decimal points'
          }
        }
        this.validate[key] = validate;
        this.validate.reason = reason
      }
      if(Object.values(this.validate).includes(false)) return false;
      return true;
    },
    save: async function(){
      if(this.validateFields()){
        let result
        try {
          result = await axios.put(`${process.env.SERVER_HOST}/products`, { data: this.product });
          if(result && result.data){
            if(result.data === 'updated'){
              this.$swal('Updated', 'Updated successfully!','success')
              this.$router.push('/');
            }else{
              this.$swal('Ops!', `There is something wrong during update ${result}`,'error')
            }
          }else this.$swal('Ops!', `Failed to update ${result.data}`,'error')
        }catch(err){
          console.log('Failed to update product: ', err);
          this.$swal('Ops!', `Failed to save ${err}`,'error')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.product-container {
  width: 420px;
  margin: 0 auto;

  .detail, .action {
    margin-top: 15px;
  }
  .detail .label{
    margin-bottom: 5px;
  }
}
.error{
  color:red;
}
</style>