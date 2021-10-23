import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Card, Table, ButtonGroup } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';

document.title = `ChingMusic | CheckOut`;

function Checkout() {

    const [cart, setCart] = useState([]);
    const [loading, setloading] = useState(true);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [checkoutInput, setCheckoutInput] = useState({
        fullname: '',
        email: '',
        provinceID: '',
        districtID: '',
        address: '',
        phone: '',
        note: '',
    });
    const [errorlist, setError] = useState([]);
    const history = useHistory();

    let total_quantity = 0;
    let totalCartPrice = 0;
    let quantityproduct = 0;
    let totalOrder = 0;



    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        swal("Waring", "Login to go to checkout", 'error');
    }

    const selectProvince = (e) => {
        e.persist();
        const province_id = e.target.value;
        setCheckoutInput({ ...checkoutInput.provinceID, [e.target.name]: e.target.value })
        axios.post(`/api/select-district/${province_id}`).then(res => {
            if (res.data.status === 200) {
                setDistrict(res.data.district);
            } else {
                console.log("failed");
            }
        })
    }
    // console.log("province: " + checkoutInput.provinceID);
    // console.log("district: " + checkoutInput.districtID);


    const selectDistrict = (e) => {
        e.persist();
        // setCheckoutInput({ ...checkoutInput.districtID, [e.target.name]: e.target.value });
        checkoutInput.districtID = e.target.value;
        console.log("province: " + checkoutInput.provinceID);
        console.log(checkoutInput.districtID);
    }

    const handleInput = (e) => {
        e.persist();
        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    }

   

    const submitCheckOut = (e, payment_mode) => {
        e.preventDefault();

        const data = {
            fullname: checkoutInput.fullname,
            email: checkoutInput.email,
            phone: checkoutInput.phone,
            provinceID: checkoutInput.provinceID,
            districtID: checkoutInput.districtID,
            address: checkoutInput.address,
            note: checkoutInput.note,
            number: quantityproduct,
            total_price: totalOrder,
            payment_mode: payment_mode,
            payment_id: ''
        }

        axios.post(`/api/place-order`, data).then(res => {
            if (res.data.status === 200) {
                swal('Order successfully', res.data.message, 'success');
                setError([]);
                history.push('/thank-you');
            } else {
                if (res.data.status === 422) {
                    setError(res.data.errors);
                }
            }
        });
        switch (payment_mode) {
            case 'cod':
                axios.post(`/api/place-order`, data).then(res => {
                    if (res.data.status === 200) {
                        swal('Order successfully', res.data.message, 'success');
                        setError([]);
                        history.push('/thank-you');
                    } else if (res.data.status === 422) {
                        {
                            setError(res.data.errors);
                        }
                    }
                });
                break;

            case 'razorpay':
                axios.post(`/api/validate-order`, data).then(res => {
                    if (res.data.status === 200) {
                        setError([]);
                        var options = {
                            "key": "rzp_test_rAbQkiPa8m1lxr", 
                            "amount": totalOrder, 
                            "name": "Acme Corp",
                            "description": "Test Transaction",
                            "image": "https://example.com/your_logo",
                            "handler": function (response){
                                alert("Order Successfull with Razorpay id: " + response.razorpay_payment_id);
                                data.payment_id = response.razorpay_payment_id;
                                axios.post(`/api/place-order`, data).then(res => {
                                    if (res.data.status === 200) {
                                        swal('Order successfully', res.data.message, 'success');
                                        setError([]);
                                        history.push('/thank-you');
                                    }
                                });
                            },
                            "prefill": {
                                "name": data.fullname,
                                "email": data.email,
                                "contact": data.phone
                            },
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp1 = new window.Razorpay(options);
                        rzp1.open();

                    } else if (res.data.status === 422) {
                        {
                            setError(res.data.errors);
                        }
                    }
                });
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        let isMounterd = true;
        axios.get(`/api/cart`).then(res => {
            if (isMounterd) {
                if (res.data.status === 201) {
                    setCart(res.data.cart);
                    setloading(false);
                } else if (res.data.status === 401) {
                    history.push('/product');
                    swal('Warning', res.data.message, 'error');
                }
            }
        })

        axios.get(`/api/getUser`).then(res => {
            if (res.data.status === 200) {
                setCheckoutInput(res.data.user);
                setProvince(res.data.province);
                setloading(false);
            } else if (res.data.status === 401) {
                history.push('/product');
                swal('Warning', res.data.message, 'error');
            }
        })

        return () => {
            isMounterd = false;
        }
    }, [history])
    var cart_HTML = "";
    if (cart.length > 0) {
        cart_HTML =
            <div>
                <Row>
                    <Col xs={7}>
                        <Card border="warning">
                            <Card.Header
                            >Form Confirm for {checkoutInput.fullname}</Card.Header>
                            <Card.Body>
                                <Form onSubmit={submitCheckOut}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridPassword">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="text" name="email" onChange={handleInput}
                                                value={checkoutInput.email} readOnly />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridCity">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control type="text" name="phone" value={checkoutInput.phone} onChange={handleInput} />
                                            <small className="text-danger">{errorlist.phone}</small>
                                        </Form.Group>

                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>Province</Form.Label>
                                            <Form.Select defaultValue="0" name="provinceID" value={checkoutInput.provinceID}
                                                onChange={selectProvince}>
                                                <option>Choose...</option>
                                                {
                                                    province.map((item) => {
                                                        return (
                                                            <option value={item.id} key={item.id}>{item.name}</option>
                                                        )
                                                    })
                                                };
                                            </Form.Select>
                                            <small className="text-danger">{errorlist.provinceID}</small>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridPassword">
                                            <Form.Label>District</Form.Label>
                                            <Form.Select defaultValue="0" name="districtID" value={checkoutInput.districtID} onChange={selectDistrict}>
                                                <option>Choose...</option>
                                                {
                                                    district.map((item) => {
                                                        return (
                                                            <option value={item.id} key={item.id}>{item.name}</option>
                                                        )
                                                    })
                                                }
                                            </Form.Select>
                                            <small className="text-danger">{errorlist.districtID}</small>
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="formGridAddress">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control placeholder="Apartment, studio, or floor" type="text"
                                            value={checkoutInput.address} name="address" onChange={handleInput} />
                                        <small className="text-danger">{errorlist.address}</small>

                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formGridNote">
                                        <Form.Label>Note</Form.Label>
                                        <Form.Control placeholder="Note for store" type="text"
                                            value={checkoutInput.note} name="note" onChange={handleInput} />
                                        <Form.Text className="text-muted">
                                            You can write note or no
                                        </Form.Text>
                                    </Form.Group>

                                    <Button variant="dark" type="submit" className="w-100"
                                        onClick={(e) => submitCheckOut(e, 'cod')}>
                                        COD order
                                    </Button>
                                    <Button variant="primary" type="submit" className="w-100 mt-2"
                                        onClick={(e) => submitCheckOut(e, 'razorpay')}>
                                        Pay online
                                    </Button>

                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Table bordered hover>
                            <thead>
                                <tr className="text-center">
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, idx) => {
                                    let selling_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.product.selling_price));
                                    let total_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.product.selling_price * item.quantity));
                                    totalCartPrice += parseInt(item.product.selling_price * item.quantity);
                                    quantityproduct += item.quantity;
                                    total_quantity += item.quantity * 10;
                                    totalOrder = totalCartPrice + total_quantity;
                                    
                                    return (
                                        <tr key={idx} className="text-center">
                                            <td width="35%">{item.product.name}</td>
                                            <td>{selling_p}</td>
                                            <td>{item.quantity}</td>
                                            <td className="text-end">{total_p}</td>
                                        </tr>
                                    )
                                })}
                                <tr className="text-center">
                                    <td colSpan="2">Grand total</td>
                                    <td>{quantityproduct}</td>
                                    <td className="text-end">{totalCartPrice}</td>
                                </tr>
                                <tr className="text-center">
                                    <td colSpan="2">Fee Ship</td>
                                    <td>{quantityproduct}</td>
                                    <td className="text-end">{total_quantity}</td>
                                </tr>
                                <tr className="text-center">
                                    <td colSpan="2" className="fw-bold">Total Order</td>
                                   
                                    <td colSpan="2" className="text-end fw-bold">{totalOrder}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
    } else {
        <div>
            <div className="card card-body py-5 text-center shadow-sm">
                <h4>Your shopping cart is empty. You are in Checkout page</h4>
                <p>Do you want to go <Link to="/product">shopping</Link> ?</p>
            </div>
        </div>
    }

    if (loading) {
        return (
            <div className="loading"><h4>Loading checkout...</h4></div>
        )
    }
    return (
        <div className="container mt-2 mb-2">
            <Row>
                {cart_HTML}
            </Row>
        </div>
    )
}
export default Checkout;