import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import { Link , useHistory } from 'react-router-dom';
import { BsFillCartCheckFill } from 'react-icons/bs';
import Swal from 'sweetalert2';


function Home() {

    document.title = 'CHINGUMUSIC - CUNG CẤP NHẠC CỤ'

    const [category, setCategory] = useState([]);
    const [content, setContent] = useState([]);
    const [productFeatured, setProductFeatured] = useState([]);
    const [productPopular, setProductPopular] = useState([]);
    const [loading, setloading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const history = useHistory();

    useEffect(() => {
        axios.get(`/api/home`).then(res => {
            if (res.data.status === 200) {
                setCategory(res.data.category);
                setProductFeatured(res.data.product_featured);
                // setProducer(res.data.producer);
                setProductPopular(res.data.product_popular);
                setContent(res.data.content);
            }
            setloading(false);
        })
    }, [])

    if (loading) {
        return <div className='loading'><h4>Chào mừng tới ChinguMusic, vui lòng chờ...</h4></div>
    } else {
        var category_HTML = '';
        category_HTML = category.map((item) => {
            return (
                <Card className="card-category" key={item.id}>
                    <Link to={`/category/${item.slug}`} className='link'>
                        <Card.Img
                            src={`http://localhost:8000/${item.image}`}
                            alt={`${item.name}`}
                            className='card-image-category' />
                        <Card.Title className='card-title-category'>{item.name}</Card.Title>
                    </Link>
                </Card>
            )
        })
        var featured_HTML = '';
        featured_HTML = productFeatured.slice(0, 8).map((item) => {
            const submitAddtoCart = (e) => {
                e.preventDefault();
                setQuantity(1);
                const data = {
                    productID: item.id,
                    quantity: quantity,
                }
                axios.post(`/api/add-to-cart`, data).then(res => {
                    if (res.data.status === 201) {
                        Swal.fire("Thêm giỏ hàng thành công", res.data.message, "success");
                    } else if (res.data.status === 409) {
                        Swal.fire("Thông báo", res.data.message, "warning");
                    } else if (res.data.status === 401) {
                        Swal.fire("Có lỗi", res.data.message, "error");
                        history.push('/login');
                    } else if (res.data.status === 404) {
                        Swal.fire("Thông báo", res.data.message, "warning");
                    }
                });
            }
            let original_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price);
            let selling_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.selling_price);
            return (
                <Card className='card-product' key={item.id}>
                    <Link to={`/category/${item.category.slug}/${item.id}`} className='link-product'>
                        <Card.Img
                            src={`http://localhost:8000/${item.image}`}
                            className='card-image' />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text className='card-text'>
                                <p className="card-user-name small">Loại sản phẩm: {item.category.name}</p>
                                <p className="card-user-name small">Thương hiệu: {item.producer.name}</p>
                                <del className="card-user-name smaill">Giá gốc: {original_p} VNĐ</del>
                                <p className="card-user-name selling-price">Giá bán: {selling_p} VNĐ</p>
                            </Card.Text>
                            <div className="card-bottom">
                                <Button variant="danger" onClick={submitAddtoCart}><BsFillCartCheckFill /></Button>
                                <div className="card-watching">Chỉ còn: {item.number}</div>
                            </div>
                        </Card.Body>
                    </Link>
                </Card>
            )
        })
        var popular_HTML = '';
        popular_HTML = productPopular.slice(0, 8).map((item) => {
            const submitAddtoCart = (e) => {
                e.preventDefault();
                setQuantity(1);
                const data = {
                    productID: item.id,
                    quantity: quantity,
                }
                axios.post(`/api/add-to-cart`, data).then(res => {
                    if (res.data.status === 201) {
                        Swal.fire("Thêm giỏ hàng thành công", res.data.message, "success");
                    } else if (res.data.status === 409) {
                        Swal.fire("Thông báo", res.data.message, "warning");
                    } else if (res.data.status === 401) {
                        Swal.fire("Có lỗi", res.data.message, "error");
                        history.push('/login');
                    } else if (res.data.status === 404) {
                        Swal.fire("Thông báo", res.data.message, "warning");
                    }
                });
            }
            let original_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price);
            let selling_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.selling_price);
            return (
                <Card className='card-product' key={item.id}>
                    <Link to={`/category/${item.category.slug}/${item.id}`} className='link-product'>
                        <Card.Img
                            src={`http://localhost:8000/${item.image}`}
                            className='card-image' />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text className='card-text'>
                                <p className="card-user-name small">Loại sản phẩm: {item.category.name}</p>
                                <p className="card-user-name small">Thương hiệu: {item.producer.name}</p>
                                <del className="card-user-name smaill">Giá gốc: {original_p} VNĐ</del>
                                <p className="card-user-name selling-price">Giá bán: ${selling_p} VNĐ</p>
                            </Card.Text>
                            <Button variant="danger" onClick={submitAddtoCart}><BsFillCartCheckFill /></Button>
                        </Card.Body>
                    </Link>
                </Card>
            )
        })
        var content_html = '';
        content_html = content.slice(0, 3).map((item) => {
            if (item.id !== 4 && item.id !== 5 && item.id !== 6) {
                return (
                    <div className='col-md-6' key={item.id}>
                        <Card className='card-content-news' >
                            <Link to={`news/${item.id}`} className='link'>
                                <Card.Img
                                    src={`http://localhost:8000/${item.image}`}
                                    alt={`${item.name}`}
                                    className='card-image-content' />
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text className='descrip-text'>
                                        <div dangerouslySetInnerHTML={{ __html: item.description }}></div>
                                    </Card.Text>
                                </Card.Body>
                            </Link>
                        </Card>
                    </div>
                )
            } else {
                return null;
            }
        })
        var banner_HTML = '';
        banner_HTML = content.map((item) => {
            if (item.id !== 4 && item.id !== 5 && item.id !== 6) {
                return (
                    <Carousel.Item key={item.id}>
                        <Link to={`news/${item.id}`}>
                            <img
                                className="banner"
                                src={`http://localhost:8000/${item.image}`}
                                alt={item.name}
                            />
                        </Link>
                    </Carousel.Item>
                )
            } else {
                return null;
            }
        })
    }

    return (
        <div className='carousel owl-wrapper-outer'>
            <Carousel fade>
                {banner_HTML}
            </Carousel>
            <Container>
                <div className='des'>
                    <Row>
                        <Col>
                            <Link to='/news/4' className='link'>
                                <div className='box_html'>
                                    <div className='icon_html icon_installment'>
                                    </div>
                                    <div className='cap_html'>
                                        <div className='tit_html'>Trả góp</div>
                                        <div className='des_html'>Lãi suất 0%</div>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/news/5' className='link'>
                                <div className='box_html'>
                                    <div className='icon_html icon_delivery'>
                                    </div>
                                    <div className='cap_html'>
                                        <div className='tit_html'>Giao hàng</div>
                                        <div className='des_html'>Chuyên nghiệp</div>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                        <Col>
                            <Link to='/news/5' className='link'>
                                <div className='box_html'>
                                    <div className='icon_html icon_insurance'>
                                    </div>
                                    <div className='cap_html'>
                                        <div className='tit_html'>Bảo hành</div>
                                        <div className='des_html'>Hiểu quả - chất lượng</div>
                                    </div>
                                </div>
                            </Link></Col>
                        <Col>
                            <Link to='/news/4' className='link'>
                                <div className='box_html'>
                                    <div className='icon_html icon_dealer'>
                                    </div>
                                    <div className='cap_html'>
                                        <div className='tit_html'>Đại lý</div>
                                        <div className='des_html'>Trải dài khắp Việt Nam</div>
                                    </div>
                                </div>
                            </Link>
                        </Col>
                    </Row>
                </div>
                {/* Nhạc cụ */}
                <div className='category_home mt-4'>
                    <div className='box_category_home'>
                        <h2 className='title_category_home'>Nhạc cụ</h2>
                        <div className='cards'>
                            {category_HTML}
                        </div>
                    </div>

                </div>
                {/* Featured product */}
                <div className='featured_product'>
                    <div className='box_category_home'>
                        <h2 className='title_category_home'>Nhạc cụ nổi bật</h2>
                        <div className="cards">

                            {featured_HTML}

                        </div>
                    </div>
                </div>
                <div className='see_more'>
                    <Link to='/product' className='link-seemore'><h4>Xem thêm...</h4></Link></div>
                {/* Popular product */}
                <div className='popular_product'>
                    <div className='box_category_home'>
                        <h2 className='title_category_home'>nhạc cụ phổ biến</h2>
                        <div className='cards'>

                            {popular_HTML}

                        </div>
                    </div>
                </div>
                <div className='see_more'><Link to='/product' className='link-seemore'><h4>Xem thêm...</h4></Link></div>
                {/* Content */}
                <div className='content-container'>
                    <div className='box_category_home'>
                        <h2 className='title_category_home'>TIN TỨC - SỰ KIỆN</h2>
                        <div className='row'>

                            {content_html}

                        </div>
                    </div>
                    <div className='see_more'><Link to='/news' className='link-seemore'><h4>Xem thêm...</h4></Link></div>

                </div>
            </Container>
        </div>
    )
}
export default Home;