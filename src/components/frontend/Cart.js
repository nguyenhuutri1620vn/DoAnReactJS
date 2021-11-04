import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { BsFillTrashFill } from "react-icons/bs";
document.title = `ChingMusic | Giỏ hàng`;

function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setloading] = useState(true);
    const history = useHistory();

    let total_quantity = 0;
    let totalCartPrice = 0;
    let totalOrder = 0;

    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        swal("Thông tin", "Đăng nhập để tiếp tục", 'error')
    }

    const handleDecrement = (cartID) => {
        setCart(cart =>
            cart.map((item) =>
                cartID === item.id ? { ...item, quantity: item.quantity - (item.quantity > 1 ? 1 : 0) } : item
            )
        );
        updateQuantity(cartID, "dec")
    }
    const handleIncrement = (cartID) => {
        setCart(cart =>
            cart.map((item) =>
                cartID === item.id ? { ...item, quantity: item.quantity + (item.quantity < 10 ? 1 : 0) } : item
            )
        );
        updateQuantity(cartID, "inc")
    }

    function updateQuantity(cartID, scope) {
        axios.put(`/api/update-cart/${cartID}/${scope}`).then(res => {
            if (res.data.status === 200) {
                // swal("Success", res.data.message, 'success');
                console.log(res.data.message);
            } else if (res.data.status === 401) {
                swal("Thông báo", res.data.message, 'erorr');
            }
        });
    }

    const deleteItemCart = (e, cart_id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "...";

        axios.delete(`/api/deleteitemcart/${cart_id}`).then(res => {
            if (res.data.status === 200) {
                swal("Xóa thành công", res.data.message, 'success');
                thisClicked.closest("tr").remove();
            } else if (res.data.status === 404) {
                swal("Thông báo", res.data.message, 'error');
                thisClicked.innerText = "Xóa";
            }
        })
    }

    useEffect(() => {
        let isMounterd = true;
        axios.get(`/api/cart`).then(res => {
            if (isMounterd) {
                if (res.data.status === 201) {
                    setCart(res.data.cart);
                    setloading(false);
                } else if (res.data.status === 401) {
                    history.push('/product');
                    swal('Thông báo', res.data.message, 'error');
                }
            }
        })
        return () => {
            isMounterd = false;
        }
    }, [history])

    if (loading) {
        return (
            <div className="loading"><h4>Đang tải, vui lòng chờ...</h4></div>
        )
    }
    var cart_HTML = "";
    if (cart.length > 0) {
        cart_HTML =
            <Row>
                <Col xs={8}>
                    <Col>
                        <div className="table-response">
                            <table className="table table-borderless table-light">
                                <thead>
                                    <tr>
                                        <th className="text-center">#</th>
                                        <th className="text-center">Hình ảnh</th>
                                        <th>Sản phẩn</th>
                                        <th className="text-center">Giá</th>
                                        <th className="text-center">Số lượng</th>
                                        <th className="text-center">Tổng giá</th>
                                        <th className="text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, idx) => {
                                        let selling_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.product.selling_price));
                                        let total_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.product.selling_price * item.quantity));
                                        totalCartPrice += parseInt(item.product.selling_price * item.quantity);
                                        total_quantity += item.quantity * 10;
                                        totalOrder = totalCartPrice + total_quantity;
                                        return (
                                            <tr key={idx}>
                                                <td></td>
                                                <td className='col-3 col-sm-1'>
                                                    <img
                                                        width="95px"
                                                        height="100px"
                                                        src={`http://localhost:8000/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className='border'
                                                    >
                                                    </img>
                                                </td>
                                                <td width="col-3 col-sm-2 productnames-cart">
                                                    <Row className="nameproduct-cart">{item.product.name}</Row>
                                                    <Row className="mt-2"></Row>
                                                    <Row className="nameproduct-cart note-product-cart">
                                                        Thể loại: {item.product.category.name},
                                                        Thương hiệu: {item.product.producer.name}
                                                    </Row>
                                                </td>
                                                <td >
                                                    <Col><p className="original_cart ">{selling_p} VNĐ</p></Col>
                                                </td>
                                                <td className='col-3 col-sm-2'>
                                                    <div className="input-group">
                                                        <button className='input-group-text' onClick={() => handleDecrement(item.id)} type="button">-</button>
                                                        <div className="form-control text-center">{item.quantity}</div>
                                                        <button className='input-group-text' onClick={() => handleIncrement(item.id)} type="button">+</button>
                                                    </div>
                                                </td>
                                                <td className='col-3 col-sm-2 text-center'>
                                                    <Col><p className="selling_cart">{total_p} VNĐ</p></Col>
                                                </td>
                                                <td><Button variant="danger" onClick={(e) => deleteItemCart(e, item.id)}>
                                                    <BsFillTrashFill />
                                                </Button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Col>
                <Col>
                    <Card style={{ width: '22rem' }} border="warning">
                        <Card.Body>
                            <Card.Text>
                                <h5>Tổng sản phẩm:
                                    <span className="float-end">{totalCartPrice}</span>
                                </h5>
                                <h5>Phí di chuyển (10$/1P):
                                    <span className="float-end">{total_quantity}</span>
                                </h5>
                                <h5>Tổng hóa đơn:
                                    <span className="float-end">{totalOrder}</span>
                                </h5>
                            </Card.Text>
                            <Button variant="secondary" className="w-100" href="/checkout">Chuyển trang thanh toán</Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

    } else {
        cart_HTML =
            <div>
                <div className="card card-body py-5 text-center shadow-sm">
                    <h4>Giỏ hàng của bạn hiện tại không có sản phẩm</h4>
                    <p>Trở lại trang chủ tại <Link to="/product">đây</Link> ?</p>
                </div>
            </div>
    }

    return (
        <div className="container">
            <div className="py-4">

                {cart_HTML}

            </div>
        </div>
    )
}
export default Cart;