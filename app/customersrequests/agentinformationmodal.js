import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import  Alert from 'react-bootstrap/Alert';
import md5 from "md5";
import { ConfirmCashPayment } from '../../../redux/slices/payementSlice';
import { Row } from 'react-bootstrap';


function ModalAgentinfo({showModal}) {
    const dispatch = useDispatch()
    const navigate = useNavigate();
  
  // Login Customer Code
  const getCustomerInfo = useSelector((state) => state.CustomerAccount)
  const { SignIn, statusLogin,CustomerToken, errorLogin,CustomerEmail,phoneNumber } = getCustomerInfo
      const getPaymentState = useSelector((state) => state.PaymentPaySlice)
      const { savedretailcustomerinvoicestate,paymentSuccess,showTrCodeCashmodalstate,cashpayMESSAGEDESC,transactionCashRef,requestIDCashref,kurimipayMESSAGEDESC,paymentState } = getPaymentState
  //const [show, setShow] = useState(false);
  //const [show, setShow] = useState(showModal); // السابق الصالج
 const [show, setShow] = useState(showTrCodeCashmodalstate);
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const [showLoginModal, setShowLoginModal] = useState(showTrCodeCashmodalstate);
    const [mobileNumber, setMobileNumber] = useState('');
        const [CashOTP, setCashOTP] = useState(null);

    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);

    const [msg, setMsg] = useState('');

    const handleLoginModalClose = () => setShowLoginModal(false);
    const handleLoginModalShow = () => {
        setShowLoginModal(true);
        setShow(false)
    }
        

    let timestamp =  Date.now()  
    const trcode = md5(transactionCashRef+CashOTP);

    const ConfirmCashTrCode = async (event) => { // التحقق من عملية طلب الدفع عبر OTP كود
      event.preventDefault();
      const form = event.currentTarget;
         const SpId = '5145642317602846'
      const UserName = 'rabee.pay'
    const MDToken = md5(SpId+ UserName+ timestamp);

      const data = {
        RequestID: requestIDCashref,
        UserName: UserName,
        SpId: SpId,
        MDToken: MDToken,
        TransactionRef: transactionCashRef,
        TRCode: trcode
         }

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        setValidated(true);
            console.log('data ConfirmCashTrCode:', data)
          const response =  dispatch(ConfirmCashPayment(data))
            response.then((result)=> {
              if (result.rows == undefined) { 
                setMsg('رمز التحقق غير مطابق')            
               // alert('تأكد من رقم تلفونك وكلمة المرور')
              } else {
                setMsg('تم تأكيد طلب الدفع بنجاح')

              }

            })
            //
           // setShow(false)
      }
    
  }

  return (
    <>
    {
      
        <Container fluid="sm" >
            <Row>
          
              <Col>
              <div className='d-flex '>
              <Alert variant='warning' className='alexandria-span'>قم بتسجيل الدخول لإكمال الدفع
                <div className='div-hover' >
               <Button className='button-alhamdi' onClick={handleLoginModalShow}>
            دخول
              </Button>
                </div>

              </Alert>
             
            </div>
            <div>
            
            </div>
              </Col>
            </Row>
                    <Modal show={showLoginModal} onHide={handleLoginModalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title> تأكيد عملية دفع الكتروني </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={validated}>
                        
                        <Form.Label>{msg ? msg : null}</Form.Label>
                        <Form.Text muted className="text-center">
                          {paymentState}
                          {cashpayMESSAGEDESC}
                        </Form.Text>
                        <Form.Group as={Col} controlId="formGridAddress1">
                            <Form.Label>رمز التحقق </Form.Label>
                            <Form.Control 
                            required
                            type='text' 
                            placeholder="رمز التحقق"  
                            onChange={(e) => {
                                setCashOTP(e.target.value)
                                }} />
                                <Form.Control.Feedback type="invalid">
                                      ادخل رمز التحقق الذي وصل الى هاتفك
                                    </Form.Control.Feedback>
                        </Form.Group>
                  

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleLoginModalClose}>
                        اغلاق
                        </Button>
                        <Button type="submit" variant='#fcac00' className='button-alhamdi' onClick={ConfirmCashTrCode}>
                         تأكيد الدفع
                        </Button>
                    
                    </Modal.Footer>
                    </Modal>
                
        </Container>
        
    }
 
    </>
  );
}

export default ModalAgentinfo;