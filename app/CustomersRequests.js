import React,{useState,useEffect, useRef } from 'react'
//import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';
import Stack from 'react-bootstrap/Stack';

import '../App.css';
// Importing toastify module
 
// Import toastify css file

import { CustomerLogOut,Customerlogin } from '../redux/slices/CustomersSlice';
//Axios.defaults.baseurl = process.env.react_app_be_url;
import { addToOrder, updateOrderStatues,productQuantityMaunesInStore,updateQuantityProductInbuyerrequests,fetchproductquantityInStore } from '../redux/slices/basketSlice';
import { productQuantityMaunesInDatabase } from '../apis/requestsapi';
import RefArray from './refArray';
import RefObject from './RefObject';

  const CusomerRequests = () => {


    const navigate = useNavigate();
    const dispatch = useDispatch()

       // قارن القيمة بالنص 'true' لتتأكد
const isIsLOCALHOSTEnabled = process.env.REACT_APP_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5001'
const remoteserver = process.env.REACT_APP_API_URL

// الآن سيعمل المنطق بشكل سليم 100%
const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn,CustomerToken, statusLogin, errorLogin,CustomerEmail,phoneNumber } = getCustomerInfo

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken,branchId,branchName, SignInAdmin,adminEmail,statusAdminLogin,permissionAdmin } = getAdminInfo
    
    const getbuyerRequests = useSelector((state) => state.basket)
    const { orderBasketlist,store_id,storeAddress,productQuantityItemNo,productquantitymaunesInstore,fetchProductIdQuantity,productQuantityInStore, buyerRequests,updateOrderState,publicEventsMessage} = getbuyerRequests
   // const [productQuantityInStore, setProductQuantityInStore] = useState(null)
    console.log('buyerRequests[0] ',buyerRequests)

    console.log('homepage userToken..',userToken)
    const [time, setTime] = useState('fetching')  
  
  


//function HomePage() {
  //const [error, setError] = useState(null);
  const [error] = useState(null);
    let [tire, setTire] = useState("⬇️ Select a tire ⬇️")
    let [tiresize, setTireSize] = useState("⬇️ Select a tire Size ⬇️")
    //let [tireList, setTireList]=useState([]);
    let [requestsList, setRequestsList]= useState([]);
    let [requestToBasket, setRequestToBasket]=useState();
    let [copyRequests, setCopyRequests]= useState(requestsList);
    let [tiresOnSize, setTireOnSize] = useState([])
    let [DolarexchangeRial, setDolarexchangeRial] = useState()
    let [RySaudixchangeRial, setRySaudixchangeRial] = useState()

    
    let [productprice, setProductPrice] = useState()
    let [productrialprice, setProductRialPrice] = useState(productprice * DolarexchangeRial)
    let [fetchItemNo, setfetchItemNo] = useState(null)
    let [fetchProduct_id, setFetchProduct_id] = useState(null)
    const [getreqId, setgetReqId] = useState(null)
    let [visible, setVisible] = useState(false)
    let [editProductQuantity, setEditProductQuantity] = useState(null)
    let [approvedQuantity, setApprovedQuantity] = useState(null)

    console.log(' copyRequests:', copyRequests)

    const inputRefs = React.useRef([]);
    
    
 
    // Click Handler updates the login state
    // when the button is clicked
 
    useEffect(()=>{
      if(!SignInAdmin) {
          navigate('/adminlogin')
      }
  },[SignInAdmin])
    /*
  useEffect(() => {
    dispatch(getStoreId(branchId))
  }, [branchName])
*/
        const user = {
          userToken : userToken
        }

        // طلبات عملاء الجملة
    const getData = async () => {
      const headers = { 'Authorization': `Bearer ${userToken}` };
      try {
         axios.get(`${server}/getBuyerRequests`,
          {headers})
        .then((res)=> {
          // السابق الصالح
          setRequestsList(res.data)
          setCopyRequests(res.data)
      })
    } catch (error) {
        // Handle error
        console.error(error);
      }
      
    }

 

    useEffect(()=> {
       getData().then(()=> 
       yemeniRials()
      )
   }, [])

        /*
      window.addEventListener("beforeunload", (event)=> {
        getData()
      })
      */
      window.addEventListener("load", (event) => {
      })

      const showEditQuantity = ((vis) => {
        setVisible(!vis)
      })
      
      const editQuantity = ((request) => {
        //const editProductQuantity =
        console.log('editQuantity request:',request)
        
        setEditProductQuantity(request.editProductQuantity)
        //setfetchItemNoForQuantity(request.itemNo)
        //dispatch(updateQuantityProductInbuyerrequests(request))
      })

      //function updateMember(index, value) {
      const editQuantityByRef = ((index, value) => {
        setApprovedQuantity(value)
      })
   

      const deleteItemById = (itemId) => {
        console.log('deleteItemById request_id:',itemId)
        const index = copyRequests.findIndex(item => item.request_id === itemId);
        if (index !== -1) {
          const newArray = [...copyRequests.slice(0, index), ...copyRequests.slice(index + 1)];
          setCopyRequests(newArray);
        }
      };

  //}
 

  /*
        useEffect(()=>{
          fitchTiresFromTireSize(tiresize)
          },[tiresize])
        */
        const yemeniRials = ()=> {
         // axios.get(`https://server.alhamditires.com/getexchangeDolar`).then((data)=>{
          axios.get(`${server}/getexchangeDolar`).then((data)=>{
            setDolarexchangeRial(data.data[0].DolarexchangeRial);
            setRySaudixchangeRial(data.data[0].KSAxchangeRial);

            setProductRialPrice(productprice * DolarexchangeRial)
         })
        }
        
        /*
          useEffect(()=> {
           
            dispatch(updateOrderStatues(getreqId)) // تغيير حالة المنتج من طلب جديد الى منفذ
            deleteItemById(getreqId) // حذف المنتج من قائمة الطلبات في المصفوفة
          }, [getreqId])
          */
          // وظيفة جلب مخزون المنتج
          const  getQuantityForProduct =  ((product) => {
              dispatch(fetchproductquantityInStore(product))

       })

   

          function addOrder  (reqests)   {
            const req_id = reqests.request_id
            const itemNo = reqests.itemNo
            const productid= reqests.product_id
            const quantity = reqests.approvedQuantity

            console.log('addOrder parameters:',req_id,itemNo,productid,quantity)
            setgetReqId(req_id)

          const q = productQuantityInStore - quantity
          console.log('addOrder q:',q)
          dispatch(updateOrderStatues(req_id)) // newRequest => done تغيير حالة المنتج من طلب جديد الى منفذ
          dispatch(addToOrder(reqests))
               
        
          deleteItemById(req_id) // حذف المنتج من قائمة الطلبات في المصفوفة
          dispatch(productQuantityMaunesInStore({q,productid,itemNo,store_id}))
        // productQuantityMaunesInDatabase({q,productid,itemNo,store_id}) // تجربة تعديل المنتج بدون استخدام dispatch
         // dispatch(updateOrderStatues(req_id)) // تغيير حالة المنتج من طلب جديد الى منفذ
       
            
          }
        
          // القديم الصالح
          //const quantity = reqests.quantity
         // console.log('quantity approvedQuantity', quantity)
          //console.log('quantity productQuantityInStore', productQuantityInStore)
       
          //console.log('q in client:',q)
       
    
         
          // deleteItemById(req_id) // حذف المنتج من قائمة الطلبات في المصفوفة
         
       
         

         /*
         const fetchProductQuantityinStore = ((reqeste) => {
          //setfetchItemNo(null)

          const itemNo = reqeste.itemNo
          const storeid = reqeste.storeid
          try {
            setfetchItemNo(itemNo)
            //if (fetchItemNo) {
              if (fetchItemNo) { 
              const res =  fetchproductquantity(reqeste)
              return res
            }
            }  catch (error) {
              console.log('undo Product Quantity Error')
              return error
            }
          
          // اضافة احذفها اذا تعطل
          //return null

         })
*/
        const click = () => {
          // setLogin((prev) => {
             console.log('dispatch AdminLogOut:')
            // dispatch(AdminLogOut())
       
            // return !prev;
           //})
         }
    // whenever a new option is selected from the dropdown
    /*
let handleTireSizeChange = (e) => {
  setTireSize(e.target.value)
  //console.log('tire Change:', tire)
}
*/
    return (
      <div>
      <Container fluid="md" className="container">   
  
      <Stack  gap={1} className="container mx-auto">
      <Form.Text muted className="text-center">
      <h4>
    شاشة طلبات العملاء الواردة
      </h4>
      
      </Form.Text>
     
    </Stack>  

        <Row direction="horizontal">
          <Col sm={4}>
          <h6>fetchProductIdQuantity {fetchProductIdQuantity}</h6>
          <h6>productQuantityInStore {productQuantityInStore}</h6>
          <h6>updateOrderStatues: {updateOrderState}</h6>
          <h6>productQuantityMaunesInStore: {productquantitymaunesInstore}</h6>
          <h6>
          <ListGroup.Item>{DolarexchangeRial} صرف الدولار </ListGroup.Item>
          <ListGroup.Item>{RySaudixchangeRial} صرف الريال السعودي </ListGroup.Item>
          </h6>
          </Col>
        <Col sm={4}></Col>
        <Col sm={4}>
        <h6>{adminEmail}</h6>
        <Button variant="secondary" as='button' onClick={()=> navigate('/requests') }>الفاتورة </Button>

        </Col>
         
        </Row>       
           <Container>                
            <Row>
              <Col>
            
              </Col>
              <h6>{branchName}</h6>
              <h6>{storeAddress}</h6>
              <h6>{store_id}</h6>
                <h6> الطلبات الواردة </h6>
                <br />
                   <Table striped bordered hover variant="dark" responsive>
           <thead>
                   
                   <tr>
                   <th>رقم الطلب</th>
                        <th>العميل </th>
                        <th>رقم المنتج</th>
                        <th> رقم الصنف</th>
                        <th> المنتج</th>
                        <th> الكمية المطلوبة</th>
                        <td>الكمية المعتمدة</td>
                        <td>سعر الوحدة </td>
                        <th> المخزون
                      
                        </th>

                   </tr>
                 </thead>
           {//tireList.map((val)=>{
             // Array.isArray(tireList) ?
             // السابق الصالح من قاعدة البيانات مباشرة
            // requestsList.map((val)=>{

              copyRequests.map((val,i)=>{
                  const {buyer_id, buyerShopName,product_id, itemNo, product,quantity,request_id,storeid, stateRequest,price, total} = val;
                 const totalPriceForProduct = price * approvedQuantity
                 console.log('totalPriceForProduct',totalPriceForProduct)
                 console.log('val.storeid:', storeid)
 //console.log('reqestToBasket:', reqestToBasket)
                 //  const url ='https://web.whatsapp.com/send?phone=967775955150&text='
                  // + ' من فضلك احتاج شراء اطار ماركة' +val.brandname+ ' المقاس:'+ val.tiresize 
                  const url ='https://wa.me/967775955150?text='+' من فضلك اهتم بطلب   العميل' +buyerShopName+ ' وطلب هذه البضاعة:'+ product 
                  + ' والكمية:'+ quantity  
                  return (
                    store_id == storeid ? 
                    <tbody> 
                    <tr  key={product_id}>
                      <td>{request_id}</td>
                      <td> {buyerShopName } </td>
                      <td>{product_id}</td>
                      <td> {
                      itemNo 
                      
                        } </td>
                      <td> {product } </td>
                      <td >{quantity}</td>
                        <td>
                        <div key={i}>
                    <Form.Control type='text' placeholder=' الكمية المعتمدة' 
                      ref={(element) => inputRefs.current[i] = element} id={`input-array-${i+1}`} 
                    // onChange={(e) => updateMember(i, e.target.value)}
                       onChange={(e) => editQuantityByRef(i, e.target.value)}
                     >
                      </Form.Control>
                        
                  </div>
                        </td>
                      <td>{price}</td>
                      <td key={itemNo}>
                    {
                       //fetchItemNo == itemNo  ? (
                        fetchProductIdQuantity == product_id ? (
                        <td>{
                          productQuantityInStore < 0 ?
                         (
                          0
                         ) : productQuantityInStore
                             
                          }</td>
                      ) : null
                    } 
                      </td>
                      <td>
                  
   
                      </td>
                      <td>
                    
                      <button onClick={() => getQuantityForProduct({product_id,itemNo,storeid})
                      }>المخزن</button>
            { 
                  stateRequest == "newRequest" ?
                   
                  fetchProductIdQuantity == product_id &&  productQuantityInStore > 0 ? (
                    <button onClick={
                      () => addOrder({
                        buyer_id,
                        buyerShopName,
                        product_id,
                        itemNo,
                        product,
                        productQuantityInStore,
                        approvedQuantity,
                      //editProductQuantity,
                        request_id,
                        price,
                        totalPriceForProduct
                      })
                    }>اضافة الى الفاتورة</button>
 

            
                    ) :       fetchProductIdQuantity == product_id &&  fetchItemNo == itemNo &&  productQuantityInStore <= 0 ? (
                     
                      <Badge bg="danger" as={Button}> اشعار
                          </Badge>
                      ) : null
             
                   : null
                } 
        
        { 
                  stateRequest == "success" ?
                   (
                    <Badge bg="secondary" as={Button} onClick={
                      () => click()
                      } > تم التنفيذ 
                        </Badge>
                  )
             
                   : null
                } 
      
                      </td>
                    </tr>
                  </tbody>

                          : null
    
                
                    ) 
                
            
})
               // : null

              } 
          </Table>
        </Row>
     </Container>            
        
</Container>
</div>
    )
  }

export default CusomerRequests;
