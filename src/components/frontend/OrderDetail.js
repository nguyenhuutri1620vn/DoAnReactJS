import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, ListGroup, Row, Table } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

function OrderItem(props) {
    document.title = "CHINGU | Đơn hàng chi tiết"

    const [loading, setloading] = useState(true);
    const history = useHistory();
    const [orderItem, setOrderItem] = useState([]);
    const [order, setOrder] = useState([]);

    useEffect(() => {
        const order_id = props.match.params.id;
        axios.get(`/api/orderitem/${order_id}`).then(res => {
            if (res.data.status === 200) {
                setOrderItem(res.data.orderitem);
                setOrder(res.data.order);
                setloading(false);
            } else if (res.data.status === 419) {
                history.push('/product');
                Swal.fire('Thông báo', res.data.message, 'error');
            }
        })
    }, [history, props.match.params.id])

    if (loading) {
        return <div className="loading"><h4>Đang tải vui lòng đợi ...</h4></div>
    } else {
        var orderHistory_HTML = '';
        orderHistory_HTML = orderItem.map((item, idx) => {
            let price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price);
            return (
                <tr key={idx}>
                    <td>#</td>
                    <td className='text-center'>{item.product.name}</td>
                    <td className='text-center'>{item.count}</td>
                    <td className='text-center'>
                        <img
                            width="95px"
                            height="100px"
                            src={`http://localhost:8000/${item.product.image}`}
                            alt={item.product.name}
                            className='border'
                        >
                        </img>
                    </td>
                    <td className='text-center'>{price}</td>
                </tr>
            )
        })
    }

    return (
        <div>
            <div className="container mt-2 mb-2">
                <div className="container mt-2 mb-2">
                    <Breadcrumb>
                        <Breadcrumb.Item href="/product" className='link-product'>
                            Trang chủ
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="/order-history">
                            Lịch sử đơn hàng
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Chi tiết đơn hàng
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            {order.tracking_no}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Row>
                        <Col xs={3}>
                            <ListGroup defaultActiveKey="#link1">
                                <ListGroup.Item action href={`/profile`}>
                                    Thông tin cá nhân
                                </ListGroup.Item>
                                <ListGroup.Item action href={`/change-password`}>
                                Đổi mật khẩu
                                </ListGroup.Item>
                                <ListGroup.Item action href={`/order-history`} disabled>
                                    Lịch sử đơn hàng
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col>
                            <h4 className="mb-2">Đơn hàng chi tiết</h4>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th className='text-center'>Sản phẩn</th>
                                        <th className='text-center'>Số lượng</th>
                                        <th className='text-center'>Hình ảnh</th>
                                        <th className='text-center'>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderHistory_HTML}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
export default OrderItem