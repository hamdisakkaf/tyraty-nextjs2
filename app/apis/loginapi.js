import axios from "axios";
// جلب اسم الفرع بواسطة معرف الفرع
export async function getBranch (data)  {
    console.log('getBranch:', data)
  
    await axios.post('https://tyraty-server.onrender.com/getBranchName',{data},
  )
 
  
  }
  