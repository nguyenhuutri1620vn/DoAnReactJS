import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button, Card, Table, Modal } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom'

function Checkout() {
    document.title = `ChingMusic | Thanh toán`;

    const [cart, setCart] = useState([]);
    const [loading, setloading] = useState(true);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
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
    let total_quan = 0;
    let total_o = 0
    let total_cart = 0
    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        Swal.fire("Thông báo", "Đăng nhập để cho thể thanh toán", 'error');
    }
    const selectDistrict = (e) => {
        e.persist();
        checkoutInput.districtID = e.target.value;
        console.log(checkoutInput.districtID);
        console.log(checkoutInput.provinceID);
    }
    const selectProvince = (e) => {
        e.persist();
        const province_id = e.target.value;
        checkoutInput.provinceID = e.target.value;
        axios.post(`/api/select-district/${province_id}`).then(res => {
            if (res.data.status === 200) {
                setDistrict(res.data.district);
            } else {
                console.log("failed");
            }
        })
    }
    const handleInput = (e) => {
        e.persist();
        setCheckoutInput({ ...checkoutInput, [e.target.name]: e.target.value });
    }

    const orderpaypal_data = {
        fullname: checkoutInput.fullname,
        email: checkoutInput.email,
        phone: checkoutInput.phone,
        provinceID: checkoutInput.provinceID,
        districtID: checkoutInput.districtID,
        address: checkoutInput.address,
        note: checkoutInput.note,
        number: quantityproduct,
        total_price: totalOrder,
        payment_mode: "Paid by Paypal",
        payment_id: ''
    }
    //Paypal
    const PayPalButton = window.paypal.Buttons.driver("react", { React, ReactDOM });
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: "0.1",
                    },
                },
            ],
        });
    };
    const onApprove = (data, actions) => {
        // return actions.order.capture();
        return actions.order.capture().then(function (details) {
            console.log(details);
            orderpaypal_data.payment_id = details.id;
            axios.post(`/api/place-order`, orderpaypal_data).then(res => {
                if (res.data.status === 200) {
                    Swal.fire('Thanh toán thành công', res.data.message, 'success');
                    setError([]);
                    history.push('/thank-you');
                } else if (res.data.status === 422) {
                    setError(res.data.errors);
                }
            });
        });
    }
    //End
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
        switch (payment_mode) {
            case 'cod':
                axios.post(`/api/place-order`, data).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Thanh toán thành công', res.data.message, 'success');
                        setError([]);
                        history.push('/thank-you');
                    } else if (res.data.status === 422) {
                        setError(res.data.errors);
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
                            "handler": function (response) {
                                alert("Order Successfull with Razorpay id: " + response.razorpay_payment_id);
                                data.payment_id = response.razorpay_payment_id;
                                axios.post(`/api/place-order`, data).then(res => {
                                    if (res.data.status === 200) {
                                        Swal.fire('Order successfully', res.data.message, 'success');
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
                        setError(res.data.errors);
                    }
                });
                break;

            case 'paypal':
                setShow(true);
                axios.post(`/api/validate-order`, data).then(res => {
                    if (res.data.status === 200) {
                        setError([]);
                 
                    } else if (res.data.status === 422) {
                        setError(res.data.errors);
                    }
                });
                break
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
                    Swal.fire('Thông báo', res.data.message, 'error');
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
                Swal.fire('Thông báo', res.data.message, 'error');
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
                <Modal show={show} onHide={handleClose} id="paypal">
                    <Modal.Header closeButton>
                        <Modal.Title>Paypal online</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <PayPalButton
                            createOrder={(data, actions) => createOrder(data, actions)}
                            onApprove={(data, actions) => onApprove(data, actions)}
                        />
                    </Modal.Body>

                </Modal>
                <Row>
                    <Col xs={7}>
                        <Card >
                            <Card.Header
                            >Thông tin đơn hàng của {checkoutInput.fullname}</Card.Header>
                            <Card.Body>
                                <Form onSubmit={submitCheckOut}>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridPassword">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="text" name="email" onChange={handleInput}
                                                value={checkoutInput.email} readOnly />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridCity">
                                            <Form.Label>Số điện thoại</Form.Label>
                                            <Form.Control type="text" name="phone" value={checkoutInput.phone} onChange={handleInput}
                                                readOnly />
                                            <small className="text-danger">{errorlist.phone}</small>
                                        </Form.Group>

                                    </Row>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>Thành phố</Form.Label>
                                            <Form.Select defaultValue="0" name="provinceID" value={checkoutInput.provinceID}
                                                onChange={selectProvince}>
                                                <option value={null}>Chọn...</option>
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
                                            <Form.Label>Huyện</Form.Label>
                                            <Form.Select defaultValue="0" name="districtID" value={checkoutInput.districtID} onChange={selectDistrict}>
                                                <option>Chọn...</option>
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
                                        <Form.Label>Địa chỉ</Form.Label>
                                        <Form.Control placeholder="Số nhà - phường - xã" type="text"
                                            value={checkoutInput.address} name="address" onChange={handleInput} />
                                        <small className="text-danger">{errorlist.address}</small>

                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formGridNote">
                                        <Form.Label>Note</Form.Label>
                                        <Form.Control placeholder="Note for store" type="text"
                                            value={checkoutInput.note} name="note" onChange={handleInput} />
                                        <Form.Text className="text-muted">
                                            Hãy điền chú thích cho cửa hàng (có thể bỏ trống)
                                        </Form.Text>
                                    </Form.Group>

                                    <Button variant="dark" type="submit" className="w-100"
                                        onClick={(e) => submitCheckOut(e, 'cod')}>
                                        Thanh toán trực tiếp
                                    </Button>
                                    <Button variant="primary" type="submit" className="w-100 mt-2"
                                        onClick={(e) => submitCheckOut(e, 'razorpay')}>
                                        Thanh toán Razorpay
                                    </Button>
                                    <Button variant="warning" type="submit" className="w-100 mt-2"
                                        onClick={(e) => submitCheckOut(e, 'paypal')}
                                    >
                                        Thanh toán PayPal
                                    </Button>

                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Table bordered hover>
                            <thead>
                                <tr className="text-center">
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item, idx) => {
                                    totalCartPrice += parseInt(item.product.selling_price * item.quantity);
                                    quantityproduct += item.quantity;
                                    total_quantity += item.quantity * 30000;
                                    totalOrder = totalCartPrice + total_quantity;
                                    let selling_p =new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.selling_price);
                                    let total_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.product.selling_price * item.quantity);
                                    total_quan = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_quantity);
                                    total_o = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalOrder);
                                    total_cart =  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCartPrice);
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
                                    <td colSpan="2">Tổng giá</td>
                                    <td>{quantityproduct}</td>
                                    <td className="text-end">{total_cart}</td>
                                </tr>
                                <tr className="text-center">
                                    <td colSpan="2">Phí di chuyển</td>
                                    <td>{quantityproduct}</td>
                                    <td className="text-end">{total_quan}</td>
                                </tr>
                                <tr className="text-center">
                                    <td colSpan="2" className="fw-bold">Tổng hóa đơn</td>

                                    <td colSpan="2" className="text-end fw-bold">{total_o}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </div>
    } else {
        <div>
            <div className="card card-body py-5 text-center shadow-sm">
                <h4>Giỏ hàng của bạn không có sản phẩm. Bạn đang ở trang thanh toán</h4>
                <p>Quay lại trang sản phẩm tại<Link to="/product">đây</Link> ?</p>
            </div>
        </div>
    }

    if (loading) {
        return (
            <div className="loading"><h4>Đang tải, vui lòng đợi...</h4></div>
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