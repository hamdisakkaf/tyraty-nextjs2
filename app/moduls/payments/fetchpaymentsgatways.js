import React,{useEffect, useState} from 'react';
import axios from 'axios';

function Button() {
  return <button>Click me</button>;
}

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

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
