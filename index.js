const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 7000


app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})



app.get('/salesbystore/:id/product/:productId', db.getSalesByStoreId)
app.get('/salesbycountries', db.getSalesByCountries)
app.get('/salesbyproductcategories', db.getFSalesByProductCategories)
app.get('/salesreport', db.getsalesreport)
app.get('/salesbystore', db.getsalesbystore)
//app.get('/salesactualbyproductcategories', db.getASalesByProductCategories)
//app.get('/salesbyproductcategories', db.getFSalesByProductCategories)


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
