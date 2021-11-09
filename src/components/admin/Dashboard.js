import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Dashboard() {
    document.title = 'Chingu | Thống kê';

    const [product, setProduct] = useState([]);
    const [content, setContent] = useState([]);
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/api/dashboard`).then(res => {
            setProduct(res.data.product);
            setContent(res.data.content);
            setOrder(res.data.order);
            setUser(res.data.user);
        });
        setLoading(false);
    }, []);

    if(loading){
        return <div className="container loading"><h4>Đang tải dữ liệu</h4></div>
    }
    return (
        <div className="container pt-3">
            <Row>
                <Col>
                    <Card className="custom-cart-admin-sp">
                        <Card.Body className="pt-4">
                            <h1 className="text-light">
                                {product.length}
                            </h1>
                            <h4 className="text-light">Sản phẩm</h4>
                        </Card.Body>
                        <Link to="/admin/view-product" className="link-product">
                            <Card.Header className="text-light text-center custom-header-cart">DANH SÁCH SẢN PHẨM</Card.Header>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card className="custom-cart-admin-bv">
                        <Card.Body className="pt-4">
                            <h1 className="text-light">
                                {content.length}
                            </h1>
                            <h4 className="text-light">Bài viết</h4>
                        </Card.Body>
                        <Link to="/admin/view-news" className="link-product">
                            <Card.Header className="text-light text-center">DANH SÁCH BÀI VIẾT</Card.Header>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card className="custom-cart-admin-dh">
                        <Card.Body className="pt-4">
                            <h1 className="text-light">
                                {order.length}
                            </h1>
                            <h4 className="text-light">Đơn hàng</h4>
                        </Card.Body>
                        <Link to="/admin/view-order" className="link-product">
                            <Card.Header className="text-light text-center">DANH SÁCH ĐƠN HÀNG</Card.Header>
                        </Link>
                    </Card>
                </Col>
                <Col>
                    <Card className="custom-cart-admin-nv">
                        <Card.Body className="pt-4">
                            <h1 className="text-light">
                                {user.length}
                            </h1>
                            <h4 className="text-light">Nhân viên</h4>
                        </Card.Body>
                        <Link to="/admin/view-staff" className="link-product">
                            <Card.Header className="text-light text-center">DANH SÁCH NHÂN VIÊN</Card.Header>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
export default Dashboard;