import axios from 'axios';
import ReactPaginate from 'react-paginate';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';

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
    }, [pageNumber])

    const pageCount = Math.ceil(order.length / orderPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    console.log(order);
    if (loading) {
        return <div className="container loading"><h4>Đang tải đơn hàng, vui lòng đợi...</h4></div>
    } else {
        var order_HTML = ''
        order_HTML = order.slice(pagesVisited, pagesVisited + orderPerPage).map((item, idx) => {
            return (
                <tr key={idx}>
                    <td className="text-center"><Link to="#">{item.tracking_no}</Link></td>
                    <td>{item.users.fullname}</td>
                    <td>{item.phone}</td>
                    <td>{item.total_price}</td>
                    <td className="text-center"><Moment format="DD/MM/YYYY hh:mm:ss">{item.created_at}</Moment></td>
                    <td className="text-center">{item.status === 0 ? "Đang chờ duyệt" : "Đang giao hàng"}</td>
                    <td className="text-center">
                        <Link className="btn btn-light btn-xs" to="#">Duyệt đơn đặt hàng</Link>
                    </td>
                    <td className="text-center">
                        <Link className="btn btn-danger btn-xs" to="#">Hủy đơn</Link>
                    </td>
                </tr>
            )
        })
    }

    return (
        <div className="container mt-2">
            <div className="px-2">
                <h4 >Danh sách đơn hàng</h4>
                <div className="input-group mb-3">
                    <select className="custom-select">
                        <option defaultValue>Đơn hàng chưa duyệt</option>
                        <option>Đơn hàng đã duyệt</option>
                    </select>
                </div>
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
                                                        <th>Khách hàng</th>
                                                        <th>Điện thoại</th>
                                                        <th>Tổng tiền</th>
                                                        <th>Ngày tạo hóa đơn</th>
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