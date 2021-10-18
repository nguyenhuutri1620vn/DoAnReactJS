import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import { BsFillTrashFill } from "react-icons/bs";

function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setloading] = useState(true);
    const [product, setProduct] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const history = useHistory();

    let total_quantity = 0;
    let totalCartPrice = 0;
    let totalOrder = 0;

    if (!localStorage.getItem('auth_token')) {
        history.push('/login');
        swal("Waring", "Login to go to cart", 'error')
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
                swal("Warning", res.data.message, 'erorr');
            }
        });
    }

    const deleteItemCart = (e, cart_id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "...";

        axios.delete(`/api/deleteitemcart/${cart_id}`).then(res => {
            if (res.data.status === 200) {
                swal("Success", res.data.message, 'success');
                thisClicked.closest("tr").remove();
            } else if (res.data.status === 404) {
                swal("Warning", res.data.message, 'error');
                thisClicked.innerText = "Remove";
            }
        })
    }

    useEffect(() => {
        let isMounterd = true;
        document.title = `ChingMusic | Cart`;
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
        return () => {
            isMounterd = false;
        }
    }, [history])

    if (loading) {
        return (
            <div className="loading"><h4>Loading cart...</h4></div>
        )
    }
    var cart_HTML = "";
    if (cart.length > 0) {
        cart_HTML =
            <div className="table-response">
                <table className="table table-borderless table-light">
                    <thead>
                        <tr>
                            <th className="text-center">#</th>
                            <th className="text-center">Image</th>
                            <th>Product</th>
                            <th className="text-center">Price</th>
                            <th className="text-center">Quantity</th>
                            <th className="text-center">Total price</th>
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
                                            Category: {item.product.category.name},
                                            Brand: {item.product.producer.name}
                                        </Row>
                                    </td>
                                    <td >
                                        <Col><p className="original_cart ">${selling_p}</p></Col>
                                    </td>
                                    <td className='col-3 col-sm-2'>
                                        <div className="input-group">
                                            <button className='input-group-text' onClick={() => handleDecrement(item.id)} type="button">-</button>
                                            <div className="form-control text-center">{item.quantity}</div>
                                            <button className='input-group-text' onClick={() => handleIncrement(item.id)} type="button">+</button>
                                        </div>
                                    </td>
                                    <td className='col-3 col-sm-2 text-center'>
                                        <Col><p className="selling_cart">${total_p}</p></Col>
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
    } else {
        cart_HTML =
            <div>
                <div className="card card-body py-5 text-center shadow-sm">
                    <h4>Your shopping cart is empty</h4>
                    <p>Do you want to go <Link to="/product">shopping</Link> ?</p>
                </div>
            </div>
    }

    return (
        <div className="container">
            <div className="py-4">
                <Row>
                    <Col xs={8}>
                        <Col>
                            <div className="table-response">
                                <table className="table table-borderless table-background">
                                    <tbody>
                                        {cart_HTML}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Col>
                    <Col>
                        <Card style={{ width: '22rem' }} border="warning">
                            <Card.Body>
                                <Card.Text>
                                    <h5>Sub Total:
                                        <span className="float-end">{totalCartPrice}</span>
                                    </h5>
                                    <h5>Fee ship (10$/1P):
                                        <span className="float-end">{total_quantity}</span>
                                    </h5>
                                    <h5>Grand Total:
                                        <span className="float-end">{totalOrder}</span>
                                    </h5>
                                </Card.Text>
                                <Button variant="secondary" className="w-100" href="/checkout">Checkout</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default Cart;