import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, ListGroup, Row, Table } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Moment from 'react-moment';


function OrderHistory() {
    document.title = "CHINGU | Lịch sử đơn hàng"

    const [loading, setloading] = useState(true);
    const [order, setOrder] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get(`/api/getorderhistory`).then(res => {
            if (res.data.status === 200) {
                setOrder(res.data.order);
                setloading(false);
            } else if (res.data.status === 419) {
                history.push('/login');
                Swal.fire('Thông báo', res.data.message, 'error');
            }
        })
    }, [history])

    const CancelOrder = (e, id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        Swal.fire({
            title: "Xác nhận xóa sản phẩm?",
            text: "Khi mà đã xóa rồi thì không hoàn tác được!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý!',
            cancelButtonText: 'Hủy!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Xóa thành công',
                    'Poof! Sản phẩm đã được xóa!',
                    'success'
                )
                axios.post(`/api/cancel-order-cus/${id}`).then(res => {
                    if (res.data.status === 200) {
                        console.log(res.data.message);
                        thisClicked.closest('tr').remove();
                    } else if (res.data.status === 404) {
                        console.log(res.data.message);
                    }
                })
            } else {

            }
        })

    }


    if (loading) {
        return <div className="loading"><h4>Đang tải trang, vui lòng đợi ...</h4></div>
    } else {
        var orderHistory_HTML = '';
        orderHistory_HTML = order.sort((a, b) => (b.id - a.id)).map((item, idx) => {
            let price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price);
            function statusorder() {
                if (item.status === 0) {
                    return (
                        <div>
                            <p>Đang chờ duyệt.</p>
                            <Link className="text-danger" onClick={(e) => CancelOrder(e, item.id)}>Hủy đơn hàng</Link>
                        </div>
                    )
                } else if (item.status === 1) {
                    return <p className='text-info'>Đang giao</p>
                } else if (item.status === 2) {
                    return <p className='text-success'>Giao thành công</p>
                } else if (item.status === 3) {
                    return <p className='text-danger'>Đơn hàng nhân viên hủy</p>
                }
            }

            return (
                <tr key={idx}>
                    <td>#</td>
                    <td className='text-center'>
                        <Link to={`/order-detail/${item.id}`} className="link-product">{item.tracking_no}
                        </Link>
                    </td>
                    <td className='text-center'>{item.number}</td>
                    <td className='text-center'>{price}</td>
                    <td className='text-center'>{<Moment format="DD/MM/YYYY">{item.created_at}</Moment>}</td>
                    <td className='text-center'>{statusorder()}</td>
                </tr>
            )
        })
    }
    return (
        <div className="container mt-2 mb-2">
            <div className="container mt-2 mb-2">
                <Breadcrumb>
                    <Breadcrumb.Item href="/product" className='link-product'>
                        Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        Lịch sử đơn hàng
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
                        <h4 className="mb-2">Lịch sử đơn hàng</h4>
                        <Table responsive hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th className='text-center'>Mã đơn hàng</th>
                                    <th className='text-center'>Số lượng</th>
                                    <th className='text-center'>Tổng tiền</th>
                                    <th className='text-center'>Ngày mua</th>
                                    <th className='text-center'>Trạng thái</th>
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
    )
}
export default OrderHistory