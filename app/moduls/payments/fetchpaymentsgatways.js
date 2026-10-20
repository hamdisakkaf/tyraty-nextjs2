import React,{useEffect, useState} from 'react';
import axios from 'axios';

function Button() {
  return <button>Click me</button>;
}

         // قارن القيمة بالنص 'true' لتتأكد
const isIsLOCALHOSTEnabled = process.env.REACT_APP_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5000'
const remoteserver = process.env.REACT_APP_API_URL

// الآن سيعمل المنطق بشكل سليم 100%
const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

   function Fetchpaymentsgatways () {
                    //const headers = { 'Authorization': `Bearer ${userToken}` };
        const [paymentsgatways, setPaymentsgatways]=useState([]);

                try {
                // axios.get(`${server}/fetchpaymentsgatways`,  {headers})
                   axios.get(`${server}/fetchpaymentsgatways`)
                  .then((res)=> {
                    setPaymentsgatways(res.data)
                    //console.log('responseData:',res.data)
                }).catch(()=> {
                  return null
                })
                } catch (error) {
                  // Handle error
                  console.error(error);
                  return null
                }
            return paymentsgatways
              }
    
export default Fetchpaymentsgatways;
