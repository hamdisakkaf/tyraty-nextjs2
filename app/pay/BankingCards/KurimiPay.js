import React,{useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { saveRetailCustomerInvoices,payBykurimipay, resetPaymentState } from '../../redux/slices/payementSlice';
import ModalUser from '../CashTamkeen/ModalUser';
//Axios.defaults.baseurl = process.env.react_app_be_url;
  const KurimiPay = ({amount,refno,producid,brandId,itemNo,productName,tiresize,scustid,crcy,quantity,buyerReq, paymentdate}) => {
    const dispatch = useDispatch()
    const getCustomerInfo = useSelector((state) => state.CustomerAccount)
    const { SignIn,SCustID,CustomerId,CustomerToken, statusLogin, errorLogin,CustomerEmail,phoneNumber,CustomerName,AddressStreet,AddressCity } = getCustomerInfo
    //const { SignIn, statusLogin, errorLogin } = getSignIn
    const [showmodalUser, setModalUser] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false);
    const [showmodalKurimiPay, setModalKurimiPay] = useState(false);
    const [showmodalpayCashWtLogin, setModalpayCashWtLogin] = useState(false);

    const handleModalKurimiPayClose = () => setModalKurimiPay(false);
    const handleModalKurimiPayShow = () => setModalKurimiPay(true);
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({});
    const [mumiznumber, setMumizNumber] = useState(null);
     const [done, setDone] = useState(false);
    const [modalKurimiPayClose, setModalKurimiPayClose] = useState(false);
    const [paymentCards, setPaymentCards]= useState([]);
    const [date, setDate] = useState(new Date().toLocaleDateString());

       // قارن القيمة بالنص 'true' لتتأكد
const isIsLOCALHOSTEnabled = process.env.REACT_APP_ISLOCALHOST === 'true';

const localhost = 'http://localhost:5000'
const remoteserver = process.env.REACT_APP_API_URL

// الآن سيعمل المنطق بشكل سليم 100%
const server = isIsLOCALHOSTEnabled ? localhost : remoteserver

    useEffect(()=> {
        setShowSignUpForm(false)
        setModalUser(false)
        //setModalCashPay(showmodalCashPay)
        //setModalKurimiPay(false)
    },[SignIn])

    const getData = async () => {
        await  axios.get(`${server}/chooseBankCard`)
       //axios.get(`${server}/chooseBankCard`,
      //axios.get('https://server.tyraty.com/chooseBankCard',
    .then((data)=>{
        setPaymentCards(data.data)
    })
    }
    
    const invoiceElement = {
      REFNO: refno,
      SCustID:SCustID,
      producid:producid,
      itemNo: itemNo,
      productName: productName,
      tiresize: tiresize,
      quantity:quantity,
      AMOUNT:amount,
      CRCY: 'YER',
      invoiceDate: paymentdate,
  }

    const saveRetailInvoices = ((event) => {
      event.preventDefault()
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        setValidated(true);
      }
     // setModalCashPay(false)
        SignIn ? 
             // فتح نافذة الدفع باستخدام بوابة دفع بنك الكريمي
          setModalKurimiPay(true) 
          
       // console.log('invoiceElement:',invoiceElement)
        //  حفظ الفاتورة في قاعدة البيانات
        //dispatch(saveRetailCustomerInvoices(invoiceElement))
    
         //showmodalKurimiPay == false ? setModalKurimiPay(true) :  setModalKurimiPay(false)
       // : setShowSignUpForm(true) 
        : setModalUser(true) 
    })

    

        const validateValues = () => {
      let errors = {};
      
      if (mumiznumber.length < 6 ) {
        errors.mumiznumber = "تأكد من صحة كتابة رقم المميز، رقم المميز يجب ان لا يقل عن 6 ارقام";
      }
      
      if (mumiznumber.length > 6) {
        errors.mumiznumber = "رقم المميز لا يزيد عن 6 أرقام";
      }
      if (mumiznumber.length == 0) {
        errors.mumiznumber = "ادخل رقم المميز الخاص بك";
      }
      setErrors(errors)
      
      return errors;
    };

    const payBykurimiGatway = ((event)=> {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
          setValidated(true);
          try {
            const validateErrors =  validateValues()
            //console.log('customer reqest is:',buyerReq )
            console.log('customer reqest is:',invoiceElement )
            if ( mumiznumber.length = 6 ) {
              dispatch(payBykurimipay(invoiceElement))
              .then(() => {
                dispatch(resetPaymentState())
              }).then(()=> {
            //  حفظ الفاتورة في قاعدة البيانات
                dispatch(saveRetailCustomerInvoices(invoiceElement))
              })
            } else return Error
          
          } catch (error) {
            setDone(false)
            return error
          }
   
      }

      })
    
    useEffect(()=> {
        console.log('paymentCards:',paymentCards)
       getData()
   }, [])
 
    return (
      <Container fluid="md">   
        <br />   
 
              <br />
              
        <div className='button-kurimi-buy' >
        <Button variant='#5429ee' 
            className='alexandria-h2 '
            type="button"
            onClick={saveRetailInvoices}
            > دفع كريمي
             </Button> 
               </div>

           <Container>
            <Row>
              
           {//tireList.map((val)=>{
             // Array.isArray(tireList) ?
             paymentCards.map((val)=>{
                  const {id, PaymentCardName, PaymentCardNameAr, logo,PaymentCardPin} = val;

            return (
             <Col>
                <Accordion defaultActiveKey="0" flush>
           
        </Accordion>
          
              </Col>
              ) })
               // : null
              } 
              </Row>
         </Container>  
                
       
           <div>
                 {
            showmodalUser ? <ModalUser showModal={showmodalUser} /> : null
        }
              </div>
        {
            showmodalKurimiPay ? 
            <Container>
           
      <>  
      <Modal 
         size="sm"
        show={showmodalKurimiPay} 
        onHide={handleModalKurimiPayClose}>
        <Modal.Header closeButton>
          <Modal.Title>بوابة دفع بنك الكريمي</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="d-flex justify-content-around">
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top"
          width={171}
          height={180}
           src="https://kuraimibank.com/media/6341/%D9%83%D8%B1%D9%8A%D9%85%D9%8A-%D8%AC%D9%88%D8%A7%D9%84.svg" />
        <Card.Body>
          <Card.Title>دفع عبر بنك الكريمي</Card.Title>
          <Card.Text>
        اجمالي فاتورتك هي:
        <br />
        <br />
        <h4>
        <b>{amount} </b>    ريال سعودي 
      </h4>
          </Card.Text>
          <Form noValidate validated={validated}>
          <Form.Group as={Col} controlId="formGridAddress1">               
           <Form.Control required autoFocus type='number' placeholder="رقم المميز"  
							onChange={(e)=> {setMumizNumber(e.target.value)}}/>
           <Form.Control.Feedback type="invalid">
                 أدخل رقم المميز 
            </Form.Control.Feedback>
  						 <br />
                   {
                    errors.mumiznumber ? (
                  <Alert key='danger' variant='danger'>
             {errors.mumiznumber}
           </Alert>
         ) : null                      
         }
     </Form.Group>
  </Form>
          <Button type="submit" variant='#5429ee' 
           className='button-kurimi-buy' onClick={payBykurimiGatway}>دفع</Button>
        </Card.Body>
      </Card>
      </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalKurimiPayClose}>
            اغلاق
          </Button>
       
        </Modal.Footer>
      </Modal>
    </>
        </Container>
            : null
        }

 
        </Container>
            )
        }

export default KurimiPay;
