import axios from "axios";

 
export async function addkurimipay (buyerReq)  {
  try {
    await axios.post('https://tyraty-server.onrender.com/kurimipay',
      buyerReq 
    ).then((response)=> {
    console.log(response.data);
    //setMsg('تم اضافة الإطار بنجاح ')
    console.log('Sucsess add pay on kurimi gatway')
      //emptyFilds()
    })
    .catch( (error) => {
    console.log('pay on kurimi gatway error', error)
    // setMsg('حصلت مشكلة في الادخال')
    })
    } catch (error) {
      console.log('pay on kurimi gatway error:', error)
    }

 }



 
