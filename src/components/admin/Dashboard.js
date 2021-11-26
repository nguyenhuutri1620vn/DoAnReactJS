import axios from 'axios';
import React, { useEffect, useState} from 'react';
import { Accordion, Card, Col, Row, Table, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

function Dashboard() {
    document.title = 'Chingu | Thống kê';

    const [showCalendar, setShowCalendar] = useState(false);
    const [product, setProduct] = useState([]);
    const [content, setContent] = useState([]);
    const [order, setOrder] = useState([]);
    const [user, setUser] = useState([]);
    const [month, setMonth] = useState([])
    const [priceMonth, setPriceMonth] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderday, setOrderDay] = useState([]);
    const [ordermoneyday, setOrderMoneyDay] = useState([]);
    const [productSold, setProductSold] = useState([]);
    const [productDetailSold, setProductDetailSold] = useState([]);
    const [check, setCheck] = useState([]);
    const [value, setValue] = useState(new Date());
    let total_price = [];
    const handleChange = value => {
        setValue(value);
        setShowCalendar(false);
    };
    useEffect(() => {
        axios.get(`/api/dashboard`).then(res => {
            setProduct(res.data.product);
            setContent(res.data.content);
            setOrder(res.data.order);
            setUser(res.data.user);
            setMonth(res.data.month);
            setPriceMonth(res.data.totalprice);
            setOrderDay(res.data.orderday);
            setOrderMoneyDay(res.data.money_day);
            setProductSold(res.data.productsold);
            setProductDetailSold(res.data.productdetailsold);
        });
        axios.get(`/api/check-admin-staff`).then(res => {
            setCheck(res.data.users);
        })
        setLoading(false);
    }, []);

    for (let i = 0; i <= 11; i++) {
        total_price.push(priceMonth[i] / 1000000)
    }

    const data = {
        labels: ["Một", "Hai", "Ba", "Bốn", "Năm", "Sáu", "Bảy", "Tám", "Chín", "Mười", "Mười một", "Mười hai"],
        datasets: [
            {
                label: '# Đơn hàng (đơn vị tính: mỗi)',
                data: month,
                backgroundColor: 'rgb(255, 99, 132)',
                stack: 'Stack 0',
            },
            {
                label: '# Tổng tiền (đơn vị tính: triệu)',
                data: total_price,
                backgroundColor: 'rgb(75, 192, 192)',
                stack: 'Stack 1',
            },
        ],
    };

    const OutPutPDF = (e) => {
        e.preventDefault();
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;
        const marginLeft = 40;
        const doc = new jsPDF("portrait", "pt", "A4");
        doc.setFontSize(15);
        doc.setFont('Times-Roman');
        const title = `THE REPORT ${today} OF CHINGMUSIC WEBSITE`;
        const headers = [["Product name", "Quantity", "Price"]];
        const orders = `Total order: ${orderday}`
        const product_sold = `Total product sold ${productSold} include:`
        const total_price = `Total price: ${ordermoneyday}`
        const data = productDetailSold.map((item) =>
            [item.product.name, item.count, item.price]
        )
        let content = {
            startY: 120,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft + 100, 60);
        doc.text(orders, marginLeft, 80);
        doc.text(product_sold, marginLeft, 100);
        doc.autoTable(content);
        doc.text(total_price, marginLeft, 320);
        doc.text("Sign,", marginLeft + 400, 700);
        doc.save("BaoCaoTheoNgay.pdf");
    }

    const options = {
        tension: 1,
        scaleBeginAtZero: true,
        scaleStartValue: 0,
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    };
    const Submitday = (value) => {
        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }
        console.log(formatDate(value));
        axios.post(`/api/day-order/${formatDate(value)}`).then(res => {
            if (res.data.status === 200) {
                setOrderDay(res.data.orderday);
                setOrderMoneyDay(res.data.money_day);
                setProductSold(res.data.productsold);
                setProductDetailSold(res.data.productdetailsold);
            }
        })
    }
    if (loading) {
        return <div className="container loading"><h4>Đang tải dữ liệu</h4></div>
    }
    if (check.role_as === 2) {
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
                <Row className='mt-2'>
                    <h4>Bán hàng và doanh thu</h4>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Theo ngày</Accordion.Header>
                            <Accordion.Body>
                                <input
                                    value={value.toLocaleDateString()}
                                    onFocus={() => setShowCalendar(true)}
                                    className="form-control my-2"
                                />
                                <div className='calendar-container'>
                                    <Calendar
                                        onChange={handleChange}
                                        value={value}
                                        className={showCalendar ? "" : "hide"}
                                        onClickDay={Submitday}
                                    />
                                </div>
                                <Button className='float-end' variant='primary' onClick={OutPutPDF}>Xuất file pdf</Button>

                                <h6>Số đơn hàng: {orderday}</h6>
                                <h6>Thành tiền: {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ordermoneyday)}</h6>
                                <h6>Số sản phẩm đã bán <span className="text-danger">{productSold}</span> bao gồm:
                                </h6>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Số lượng</th>
                                            <th>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productDetailSold.map((item, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>{item.id}</td>
                                                    <td>{item.product.name}</td>
                                                    <td>{item.count}</td>
                                                    <td>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>

                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Theo tháng</Accordion.Header>
                            <Accordion.Body>
                                <Bar data={data} options={options} />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Row>
            </div >
        )
    } else{
        return (
            <div className='container pt-3'>
                <Card>
                    <Card.Header as="h5">Theo ngày hiện tại</Card.Header>
                    <Card.Body>
                        <input
                            value={value.toLocaleDateString()}
                            onFocus={() => setShowCalendar(true)}
                            className="form-control my-2"
                        />
                        <div className='calendar-container'>
                            <Calendar
                                onChange={handleChange}
                                value={value}
                                className={showCalendar ? "" : "hide"}
                                onClickDay={Submitday}
                            />
                        </div>
                        <Button className='float-end' variant='primary' onClick={OutPutPDF}>Xuất file pdf</Button>

                        <h6>Số đơn hàng: {orderday}</h6>
                        <h6>Thành tiền: {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ordermoneyday)}</h6>
                        <h6>Số sản phẩm đã bán <span className="text-danger">{productSold}</span> bao gồm:
                        </h6>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productDetailSold.map((item, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{item.id}</td>
                                            <td>{item.product.name}</td>
                                            <td>{item.count}</td>
                                            <td>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>

                        </Table>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}
export default Dashboard;