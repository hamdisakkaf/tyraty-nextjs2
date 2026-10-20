import axios from "axios";

 export const getposts = async () => {
         try {
           axios.get("https://tyraty-server.onrender.com/getposts")
           .then((res)=> {
             //setPosts(res.data)
            console.log('responseData:',res.data)
            return res.data
         }).catch(()=> {
           return null
         })
         } catch (error) {
           // Handle error
           console.error(error);
           return null
         }
       }
//export async function addkurimipay (buyerReq)  {
