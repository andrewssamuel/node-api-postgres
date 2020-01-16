const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'database-2.csqtwfwchjab.us-west-2.rds.amazonaws.com',
  database: 'postgres',
  password: '$ustglobal',
  port: 5432,
})



const getSalesByStoreId = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('(SELECT * FROM f_sales_by_store WHERE store_id = $1) union (SELECT * FROM a_sales_by_store WHERE store_id = $1 and year=2017) order by month', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getSalesByCountries = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('select a.country_id,a.country_name,a.latitude,a.longitude,round((fsales*tot_per)/1000000,2) as sales_items from  (select sum(sales_items) sales,c.country_name, sp.country_id,c.latitude,c.longitude,(sum(sales_items) / SUM(sum(sales_items)) OVER ()) AS "tot_per"  from a_sales_by_product_03 sp,countries c where sp.country_id = c.country_id and year = 2019 group by c.country_name, sp.country_id, c.latitude, c.longitude) a,(select sum(sales_items) fsales from sales_insights) b',(error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}



const getFSalesByProductCategories = (request, response) => {
  //const id = parseInt(request.params.id)
  str_query = 'select a.product_category_name,a.sales targeted_sales,b.sales actual_sales from (select product_category_name,sum(sales_items) as sales from sales_insights si, product_master pm, product_categories pc where si.product_id = pm.product_id and pm.product_category_id = pc.product_category_id group by product_category_name) as a,(select product_category_name,sum(sales_items) as sales from a_sales_by_product sp, product_master pm, product_categories pc where sp.product_id = pm.product_id and pm.product_category_id = pc.product_category_id and sp.year=2019 group by product_category_name) as b where a.product_category_name = b.product_category_name'
  pool.query(str_query,(error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getsalesreport = (request, response) => {
  //const id = parseInt(request.params.id)
  str_query = 'select a.product_id,a.product_name,a.product_category_name,a.sales sales_2020,b.sales sales_2019, a.sales - b.sales as difference from (select si.product_id,product_name, product_category_name, sum(sales_items) as sales from sales_insights si, product_master pm, product_categories pc where si.product_id = pm.product_id and pm.product_category_id = pc.product_category_id  group by si.product_id,product_name, product_category_name) a,(select sp.product_id,product_name, product_category_name, sum(sales_items) as sales from a_sales_by_product sp, product_master pm, product_categories pc where sp.product_id = pm.product_id and pm.product_category_id = pc.product_category_id and sp.year = 2019  group by sp.product_id,product_name, product_category_name) b where a.product_id = b.product_id'
  pool.query(str_query,(error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getsalesbystore = (request, response) => {
  //const id = parseInt(request.params.id)
  str_query = 'select si.store_id, sm.Store_Name,sum(sales_items) sales from sales_insights si, store_master sm where si.store_id = sm.Store_ID group by si.store_id,sm.Store_Name order by si.store_id fetch first 6 rows only'
  pool.query(str_query,(error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}




module.exports = {
  getSalesByStoreId,getSalesByCountries,getFSalesByProductCategories,getsalesreport,getsalesbystore
 
}
