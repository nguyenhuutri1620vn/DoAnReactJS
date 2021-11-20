import axios from 'axios';
import ReactPaginate from 'react-paginate';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

function OrderView() {
    document.title = "CHINGU | Quản lý đơn hàng";

    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    const [pageNumber, setPageNumber] = useState(0);
    const orderPerPage = 15;
    const pagesVisited = pageNumber * orderPerPage;

    useEffect(() => {
        axios.get(`/api/view-order`).then(res => {
            if (res.data.status === 200) {
                setOrder(res.data.order);
                setLoading(false);
            }
        });
    }, [pageNumber, pagesVisited])

    const update_waitingOrder = (e, order_id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "...";
        const statusOrder = document.getElementById('orderwaiting');
        Swal.fire({
            title: 'Xác minh duyệt đơn hàng?',
            text: "Sau khi duyệt, đơn hàng sẽ không thể quay lại trạng thái ban đầu!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Duyệt!',
            cancelButtonText: 'Để sau!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/update-waitingorder/${order_id}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Thành công!', res.data.message, 'success');
                        thisClicked.innerText = "Xác nhận đơn hàng";
                        thisClicked.className = "btn btn-success";
                        statusOrder.innerText = "Đơn hàng đang giao";
                        statusOrder.className = "text-info";
                        statusOrder.id = 'ordershipping'
                    } else {
                        Swal.fire('Thất bại!', res.data.message, 'warning');
                    }
                })
            } else {
                thisClicked.innerText = "Duyệt đơn đặt hàng";
                thisClicked.className = "btn btn-light";
            }
        })
    }
    const update_shippingOrder = (e, order_id) => {
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "...";
        const statusOrder = document.getElementById('ordershipping');
        const cancelOrder = document.getElementById('cancel_btn');
        Swal.fire({
            title: 'Xác nhận đơn hàng thành công?',
            text: "Sau khi duyệt, đơn hàng sẽ không thể quay lại trạng thái ban đầu!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Duyệt!',
            cancelButtonText: 'Để sau!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/update-shippingorder/${order_id}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Thành công!', "", 'success');
                        thisClicked.innerText = "Đã duyệt";
                        thisClicked.disabled = true;
                        statusOrder.innerText = "Giao hàng thành công";
                        statusOrder.className = "text-success";
                        cancelOrder.disabled = true;
                    }else{
                        Swal.fire('Thất bại!', res.data.message, 'warning');
                    }
                })
            }else {
                thisClicked.innerText = "Xác nhận đặt hàng";
            }
        })
    }
    const cancel_Order = (e, order_id) =>{
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = "...";
        // const waitingOrder = document.getElementById('waiting_btn');
        // const cofirmOrder = document.getElementById('cofirm_btn');
        Swal.fire({
            title: 'Hủy đơn hàng?',
            text: "Sau khi duyệt, đơn hàng sẽ không thể quay lại trạng thái ban đầu!",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Duyệt!',
            cancelButtonText: 'Để sau!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/cancel-order/${order_id}`).then(res => {
                    if (res.data.status === 200) {
                        Swal.fire('Thành công!', "", 'success');
                        thisClicked.disabled = true;
                        thisClicked.innerText = "Đã hủy";
                    } else {
                        Swal.fire('Thất bại!', res.data.message, 'warning');
                        thisClicked.innerText = "Duyệt đơn đặt hàng";
                    }
                })
            }else{
                thisClicked.innerText = "Hủy đơn";
            }
        })
    }
    const pageCount = Math.ceil(order.length / orderPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }
    if (loading) {
        return <div className="container loading"><h4>Đang tải đơn hàng, vui lòng đợi...</h4></div>
    } else {
        var order_HTML = ''
        order_HTML = order.sort((a, b) => (b.id - a.id)).slice(pagesVisited, pagesVisited + orderPerPage).map((item, idx) => {
            function Order_Btn() {
                if (item.status === 0) {
                    return (
                        <Button id='waiting_btn' variant="light" onClick={(e) => update_waitingOrder(e, item.id)}>Duyệt đơn đặt hàng</Button>
                    )
                } else if (item.status === 1) {
                    return (
                        <Button id="confirm_btn" variant="success" onClick={(e) => update_shippingOrder(e, item.id)}>Xác nhận đơn hàng</Button>
                    )
                } else {
                    return (
                        null
                    )
                }
            }
            function Order_text() {
                if (item.status === 0) {
                    return (
                        <p className="text-warning" id="orderwaiting">Đơn đang chờ duyệt</p>
                    )
                } else if (item.status === 1) {
                    return (
                        <p className="text-info" id="ordershipping">Đơn hàng đang giao</p>
                    )
                } else if (item.status === 2) {
                    return (
                        <p className="text-success" >Giao hàng thành công</p>
                    )
                } else {
                    return (
                        <p className="text-danger" id="ordercancel_customer">Đơn hàng nhân viên hủy</p>
                    )
                } 
            }
            function Cancel_btn() {
                if (item.status === 0 || item.status === 1) {
                    return (
                        <Button id="cancel_btn" variant='danger' onClick={(e) => cancel_Order(e, item.id)}>Hủy đơn</Button>
                    )
                } else {
                    return (
                        null
                    )
                }
            }
            let price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_price);
            return (
                <tr key={idx}>
                    <td className="text-center"><Link to="#">{item.tracking_no}</Link></td>
                    <td>{item.users.fullname}</td>
                    <td>{item.phone}</td>
                    <td >{price}</td>
                    <td className="text-center"><Moment format="DD/MM/YYYY hh:mm:ss">{item.created_at}</Moment></td>
                    <td className="text-center">{Order_text()}</td>
                    <td className="text-center">
                        {Order_Btn()}
                    </td>
                    <td className="text-center">
                        {Cancel_btn()}
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="container pt-2">
            <div className="px-2">
                <h4 >Danh sách đơn hàng</h4>
            </div>
            <div className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="box" id="view">
                            <div className="box-header with-boder">
                                <div className="box-body">
                                    <div className="row">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center">Mã đơn hàng</th>
                                                        <th className="text-center">Khách hàng</th>
                                                        <th className="text-center">Điện thoại</th>
                                                        <th className="text-center">Tổng tiền</th>
                                                        <th className="text-center">Ngày tạo hóa đơn</th>
                                                        <th className="text-center">Trạng thái</th>
                                                        <th className="text-center">Xử lý đơn</th>
                                                        <th className="text-center">Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order_HTML}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div>
                                        <ReactPaginate
                                            disabledClassName={"pagination__link--disabled"}
                                            previousLabel={'Trước'}
                                            nextLabel={'Sau'}
                                            pageCount={pageCount}
                                            onPageChange={handleChangPage}
                                            containerClassName={"paginationBttns"}
                                            previousLinkClassName={"paginationPN"}
                                            nextLinkClassName={"paginationPN"}
                                            activeClassName={"paginationActive"}
                                        >
                                        </ReactPaginate>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderView