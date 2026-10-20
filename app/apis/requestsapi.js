import axios from "axios";

export async function productQuantityMaunesInDatabase(request) {
    console.log(' requestsapi.js request: ',request)

  try {
    await axios.post('https://tyraty-server.onrender.com/productQuantityMaunesInStore',{request}
    ).then(()=> {
    //setMsg('تم اضافة الإطار بنجاح ')
    console.log('Sucsess productQuantityMaunesInDatabase')
      //emptyFilds()
    })
    .catch( (error) => {
    console.log('productQuantityMaunesInDatabase error', error)
    return error
    // setMsg('حصلت مشكلة في الادخال')
    })
    } catch (error) {
      console.log('productQuantityMaunesInDatabase error:', error)
    }

}