import React,{useState,useEffect } from 'react'
//import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'

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
import { FloatingLabel } from 'react-bootstrap';
//import { FirstRoute } from './RoutsTaps/FirstRoute';
import { useRef, forwardRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  MDBCard,
  MDBCardBody,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import '../App.css';
// Importing toastify module
 
// Import toastify css file

import { CustomerLogOut,Customerlogin } from '../redux/slices/CustomersSlice';
//Axios.defaults.baseurl = process.env.react_app_be_url;
import { addToOrder } from '../redux/slices/basketSlice';

// --- Configuration ---
 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

  const OrserBasketList = () => {
    //Now Listen for Events (welcome event).
  
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      copyStyles: true,
      pageStyle: `
        @media print {
          @page { margin: 0; }
        }
        body {
          -webkit-print-color-adjust: exact;
        }
      `,
    });

    const getorserBasketLists = useSelector((state) => state.basket)
    const { orderBasketlist,buyerShopName,request_id } = getorserBasketLists

    const getAdminInfo = useSelector((state) => state.AdminAccount)
    const { userToken, userInfo, SignInAdmin,statusAdminLogin,permissionAdmin } = getAdminInfo
    console.log('orderBasketlist SignInAdmin:', SignInAdmin)
    console.log('orderBasketlist: request', orderBasketlist)


    console.log('homepage userToken..',userToken)
    const [time, setTime] = useState('fetching')  

//function HomePage() {
  //const [error, setError] = useState(null);
  const [error] = useState(null);
    let [tire, setTire] = useState("⬇️ Select a tire ⬇️")
    let [tiresize, setTireSize] = useState("⬇️ Select a tire Size ⬇️")
    //let [tireList, setTireList]=useState([]);
    let [requestsList, setRequestsList]=useState([]);
    let [requestToBasket, setRequestToBasket]=useState();

    let [tiresOnSize, setTireOnSize] = useState([])
    let [DolarexchangeRial, setDolarexchangeRial] = useState()
    let [RySaudixchangeRial, setRySaudixchangeRial] = useState()

    
    let [productprice, setProductPrice] = useState()
    let [productrialprice, setProductRialPrice] = useState(productprice * DolarexchangeRial)

    useEffect(()=>{
      if(!SignInAdmin) {
          navigate('/adminlogin')
      }
  },[SignInAdmin])
  
        /*
      window.addEventListener("beforeunload", (event)=> {
        getData()
      })
      */
      window.addEventListener("load", (event) => {
      })
  //}

        const addOrder = ((reqests) => {
          console.log('addOrder function reqestToBasket:', reqests)
          dispatch(
            //addOrder
            addToOrder(reqests)
        
          );
         })
         const yemeniRials = ()=> {
          axios.get(`${server}/getexchangeDolar`).then((data)=>{
            setDolarexchangeRial(data.data[0].DolarexchangeRial);
            setRySaudixchangeRial(data.data[0].KSAxchangeRial);

            setProductRialPrice(productprice * DolarexchangeRial)
         })
        }

        useEffect(()=> {
       
          yemeniRials() 
         
         
      }, [])
        const click = () => {
          // setLogin((prev) => {
             console.log('dispatch AdminLogOut:')
            // dispatch(AdminLogOut())
       
            // return !prev;
           //})
         }
  
  
    return (
       
      <Container fluid="md" className="container">      
      <Stack  gap={1} className="container mx-auto">
    
      <Form.Text muted className="text-center">
      <h4>
         فواتير العملاء    
      </h4>
      
      </Form.Text>
      {time}
      {userToken}
      <div>
    <h1></h1>
    </div>
    </Stack>  
               <div >
            
               <h4>
              <Badge bg="danger"  > الفاتورة :</Badge >
              <ListGroup.Item>{DolarexchangeRial} صرف الدولار </ListGroup.Item>
              <ListGroup.Item>{RySaudixchangeRial} صرف الريال السعودي </ListGroup.Item>
              </h4>
            
               </div>
           <Container>   
           <div  ref={componentRef}> 
            <Row>
            <MDBContainer className="py-5">
      <MDBCard className="p-4">
        <MDBCardBody>
          <MDBContainer className="mb-2 mt-3">
            <MDBRow className="d-flex align-items-baseline">
              <MDBCol xl="9">
                <p style={{ color: "#7e8d9f", fontSize: "20px" }}>
                  Invoice &gt; &gt; <strong>ID: {request_id}</strong>
                </p>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBContainer>
            <MDBCol md="12" className="text-center">
              <MDBIcon
                far
                icon="building"
                size="4x"
                className="ms-0 "
                style={{ color: "#8f8061" }}
              />
              <p className="pt-2">{buyerShopName}</p>
            </MDBCol>
          </MDBContainer>
          <MDBRow>
            <MDBCol xl="8">
              <MDBTypography listUnStyled>
                <li className="text-muted">
                  To: <span style={{ color: "#8f8061" }}>John Bootstrap</span>
                </li>
                <li className="text-muted">Street, City</li>
                <li className="text-muted">State, Country</li>
                <li className="text-muted">
                  <MDBIcon fas icon="phone-alt" /> 123-456-789
                </li>
              </MDBTypography>
            </MDBCol>
            <MDBCol xl="4">
              <p className="text-muted">Invoice</p>
              <MDBTypography listUnStyled>
                <li className="text-muted">
                  <MDBIcon fas icon="circle" style={{ color: "#8f8061" }} />
                  <span className="fw-bold ms-1">ID:</span>#123-456
                </li>
                <li className="text-muted">
                  <MDBIcon fas icon="circle" style={{ color: "#8f8061" }} />
                  <span className="fw-bold ms-1">Creation Date: </span>Jun
                  23,2021
                </li>
                <li className="text-muted">
                  <MDBIcon fas icon="circle" style={{ color: "#8f8061" }} />
                  <span className="fw-bold ms-1">Status:</span>
                  <span className="badge bg-warning text-black fw-bold ms-1">
                    Unpaid
                  </span>
                </li>
              </MDBTypography>
            </MDBCol>
          </MDBRow>
          <MDBRow className="my-2 mx-1 justify-content-center">
          <MDBTable>
              <MDBTableHead >
                <tr>
                  <th scope="col"># رقم الطلب</th>
                  <th scope="col">العميل</th>
                  <th scope="col">رقم الصنف</th>
                  <th scope="col">المنتج</th>
                  <th scope="col">الكمية</th>
                  <th scope="col"> سعر الوحدة</th>
                  <th scope="col"> total product</th>
                  <th scope="col"> الإجمالي</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody >
{//tireList.map((val)=>{
  // Array.isArray(tireList) ?
 
  orderBasketlist.map((val)=>{
       const {buyerShopName, itemNo, product,price,quantity,request_id, total} = val;

   console.log('orderBasketlistRequests product:', product)
      //  const url ='https://web.whatsapp.com/send?phone=967775955150&text='
       // + ' من فضلك احتاج شراء اطار ماركة' +val.brandname+ ' المقاس:'+ val.tiresize 
        const url ='https://wa.me/967775955150?text='+' من فضلك اهتم بطلب   العميل' +buyerShopName+ ' وطلب هذه البضاعة:'+ product 
        + ' والكمية:'+ quantity  
 return (
   
     <tr>
       <th scope="row">{request_id}</th>
       <td>{buyerShopName}</td>
       <td>{itemNo}</td>
       <td>{product}</td>
       <td>{quantity}</td>
       <td>{price}</td>
       <td>{total}</td>
       <td>{quantity *price } ريال سعودي</td>
       <td>{quantity *price * RySaudixchangeRial } ريال يمني</td>

       
     </tr>
  
   )
  } 
)
     //: null

   } 
    </MDBTableBody>

              </MDBTable>
            <MDBCol md="3" className="mb-4 mb-md-0">
              <div
                className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
                data-ripple-color="light"
              >
              
                <a href="#!">
                  <div className="hover-overlay">
                    <div
                      className="mask"
                      style={{ backgroundColor: "hsla(0, 0%, 98.4%, 0.2)" }}
                    ></div>
                  </div>
                </a>
              </div>
            </MDBCol>
            <MDBCol md="6" className="mb-4 mb-md-0">
              
              <p className="fw-bold">Custom suit</p>
              <p className="mb-1">
                <span className="text-muted me-2">Size:</span>
                <span>8.5</span>
              </p>
              <p>
                <span className="text-muted me-2">Color:</span>
                <span>Gray</span>
              </p>
            </MDBCol>
            <MDBCol md="3" className="mb-4 mb-md-0">
              <h5 className="mb-2">
                <s className="text-muted me-2 small align-middle">$1500</s>
                <span className="align-middle">$1050</span>
              </h5>
              <p className="text-danger">
                <small>You save 25%</small>
              </p>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol xl="8">
              <p className="ms-3">
                Add additional notes and payment information
              </p>
            </MDBCol>
            <MDBCol xl="3">
              <MDBTypography listUnStyled>
                <li className="text-muted ms-3">
                  <span class="text-black me-4">SubTotal</span>$1050
                </li>
                <li className="text-muted ms-3 mt-2">
                  <span class="text-black me-4">Shipping</span>$15
                </li>
              </MDBTypography>
              <p className="text-black float-start">
                <span className="text-black me-3"> Total Amount</span>
                <span style={{ fontSize: "25px" }}>$1065</span>
              </p>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
            </Row>  
            </div> 
          <Row>
      
      </Row>
  
        <Button  onClick={handlePrint} variant="primary">طباعة
         </Button>

     </Container>            
    
    
</Container>

    )
  }

export default OrserBasketList;
