const express = require('express');
const app = express();
const db = require('./modules/database.js');
const _ = require('lodash');
const math = require('mathjs');
const BigNumber = require('bignumber.js');

app.get('/', function (req, res) {
  res.status(200).send('Hello World!');
});
app.get('/products', function (req, res) {
  let data
  try{
    data = db.get('products').value();
    res.status(200).send(data);
  }catch(err){
    console.log('exception retrieving products! ', err);
    res.status(-1).send(err)
  }
});

app.post('/products/search', async function(req, res) {
  const term = req.body.term.toLowerCase();
  const option = req.body.option;
  let allProducts = await db.get('products').value();
  if(!term) return res.status(200).send(allProducts);
  let result
  try{
    result = _.filter(allProducts, (product) => {
      if(option.includes('1,2')) return product.brand.toLowerCase() === term || product.name.toLowerCase() === term;
      if(option.includes('1')) return product.brand.toLowerCase() === term;
      if(option.includes('2')) return product.name.toLowerCase() === term;
    });
    result = result.map((r) => {
      console.log(Number(r['upc12']))
      r['upc12'] = +r['upc12'];
      return r;
    })
    res.status(200).send(result);
  }catch(err){
    console.log('Failed to search products!', err);
    res.status(-1).send(err)
  }
})

app.put('/products', async function(req, res) {
  try{
    req.body.data['upc12'] = (req.body.data['upc12']) ? (new BigNumber(req.body.data['upc12'])).toFixed() : null;
  }catch(err){
    console.log('err: ', err);
  }
  const input = req.body.data
  try{
    await db.get('products')
      .find({ _id: input._id })
      .assign(input)
      .write()
    res.status(200).send('updated')
  }catch(err){
    console.log("There is an issue update product", err);
    res.status(-1).send(err)
  }
})

app.get('/product/:id', async function(req, res) {
  const _id = req.params.id;
  try{
    let result = await db.get('products').find({ _id }) || null;
    res.status(200).send(result)
  }catch(err){
    console.log("There is an issue update product", err);
    res.status(-1).send(err)
  }
})

module.exports = app;