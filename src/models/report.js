
const Database = require("../database/database");
const _database = new WeakMap();
const fetch = require('node-fetch');
const puppeteer = require("puppeteer");


class Report {
  constructor() {
    _database.set(this, new Database());


  }
  async update_so_state(SO_id){
    const update_so=await await _database
    .get(this)
    .update(
      "service_order",
      ["status", "Closed"],
      ["service_order_id", "=", SO_id]
    );
    return update_so;
  }

  async get_report_pdf(SO_id) {
    const url = 'http://localhost:3000/report/get_report/'+SO_id+'/html';

        const browser = await puppeteer.launch({
            headless: true,
          
        });

            const webPage = await browser.newPage();

            await webPage.goto(url, {
                waitUntil: "networkidle2"
            });
            const path = require('path');
            const style= await webPage.addStyleTag({ path: './public/css/report_template.css'});
            await webPage.setViewport({ width: 800, height: 800 });
            await webPage.emulateMediaType('screen');
            const pdf = await webPage.pdf({
              
               preferCSSPageSize: true,
                
                printBackground: true,
                format: "A3",
              
    
                margin: {
                    top: "5px",
                    bottom: "5px",
                    left: "5px",
                    right: "5px"
                }
            });

            await browser.close();
            return pdf;

  }

  async get_SO_details() {
    console.log(_database);
 
  var result = await _database
    .get(this)
    .readMultipleTable("service_order",'LEFT', ["useracc","user_id"],["service_order.service_order_id","service_order.status","service_order.vehicle_number","service_order.start_date","useracc.NIC","useracc.first_name","useracc.last_name"],[],[],[]);
  

  return new Promise((resolve) => {
    let obj = {
      connectionError: _database.get(this).connectionError,
    };
    result.error ? (obj.error = true) : (obj.result= result.result);
    resolve(obj);
  });
}

  async get_SO(SO_id) {
     
   
    var result = await _database
      .get(this)
      .readMultipleTable("service_order",'LEFT', ["useracc","user_id","customer","user_id"],["service_order.service_order_id","customer.license_number","useracc.NIC","useracc.first_name","useracc.last_name"],["service_order.service_order_id","=",SO_id],[],[]);
     
 
    return new Promise((resolve) => {
      let obj = {
        connectionError: _database.get(this).connectionError,
      };
      result.error ? (obj.error = true) : (obj.result= result.result);
      resolve(obj);
    });
  }
  async get_test(SO_id){
    let url = "http://localhost:2000/report/json/"+SO_id;
    let settings = { method: "Get" };
    try {
      
    
    let res_data=await fetch(url, settings)
        .then(res => res.json())
        .then(async(json) => { 
           
            if(json.response.length!=0){
                
                var lasttest=json.response.length-1;
                var jsonres=(json.response[lasttest]);
               
                return jsonres;}
              else{
                return [];
              }
           
          
          
        });
       console.log(res_data);
        return res_data;
      } 
        catch (error) {
          console.log('error here');
          return {"error":"Not Connected"};
        }
    
}


}



module.exports = Report;
