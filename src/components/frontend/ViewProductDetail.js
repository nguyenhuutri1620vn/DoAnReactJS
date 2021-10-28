import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Card, Col, Figure, Row } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import Moment from 'react-moment';
import { BsFillCartCheckFill } from 'react-icons/bs';


function ViewProductDetail(props) {


    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [loading, setloading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const history = useHistory();

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevCount => prevCount - 1);
        }
    }
    const handleIncrement = () => {
        if (quantity < product.number)
            setQuantity(prevCount => prevCount + 1);
    }

    const submitAddtoCart = (e) => {
        e.preventDefault();

        const data = {
            productID: product.id,
            quantity: quantity,
        }
        axios.post(`/api/add-to-cart`, data).then(res => {
            if (res.data.status === 201) {
                swal("Thêm giỏ hàng thành công", res.data.message, "success");
            } else if (res.data.status === 409) {
                swal("Thông báo", res.data.message, "warning");
            } else if (res.data.status === 401) {
                swal("Có lỗi", res.data.message, "error");
                history.push('/login');
            }else if (res.data.status === 404) {
                swal("Thông báo", res.data.message, "warning");
            }

        });
    }

    useEffect(() => {
        let isMounterd = true;
        document.title = `ChingMusic | ${product.name}`;
        const category_slug = props.match.params.category;
        const product_id = props.match.params.product;
        axios.get(`/api/viewproductdetail/${category_slug}/${product_id}`).then(res => {
            if (isMounterd) {
                if (res.data.status === 200) {
                    setProduct(res.data.product);
                    console.log(res.data.product);
                    setCategory(res.data.category);
                    setRelatedProduct(res.data.related_product);
                    setloading(false);
                } else if (res.data.status === 404) {
                    history.push('/product');
                    swal('Thông báo', res.data.message, 'error');
                }
            }
        })
        return () => {
            isMounterd = false;
        }
    }, [props.match.params.category, props.match.params.product, history, product.name])


    if (loading) {
        return <div className='loading'><h4>Đang tải, vui lòng đợi...</h4></div>
    } else {
        var relatedProduct_HTML = '';
        relatedProduct_HTML = relatedProduct.slice(0, 5).map((item, idx) => {
            if (item.id !== product.id) {
                let original_p = new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 3 }).format(parseInt(item.original_price));
                let selling_p = new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 3 }).format(parseInt(item.selling_price));
                return (
                    <Card className='card-product-related mx-2' key={idx}>
                        <Link to={`/category/${item.category.slug}/${item.id}`} className='link-product'>
                            <Card.Img
                                src={`http://localhost:8000/${item.image}`}
                                className='card-image' />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text className='card-text'>
                                    <del className="card-user-name smaill">Giá gốc: {original_p} VNĐ</del>
                                    <p className="card-user-name selling-price">Giá bán: ${selling_p} VNĐ</p>
                                </Card.Text>
                            </Card.Body>
                        </Link>
                    </Card>
                )
            } else if (relatedProduct.length - 1 === 0) {
                return <h4 className="non-related text-uppercase mt-3 text-center">Không có sản phẩm liên quan</h4>;
            } else {
                return null;
            }
        });
    }
    let original_p = new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 3 }).format(parseInt(product.original_price));
    let selling_p = new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 3 }).format(parseInt(product.selling_price));
    return (
        <div className='container mt-2'>
            <Breadcrumb className="mb-2">
                <Breadcrumb.Item href="/product">
                    Trang chủ
                </Breadcrumb.Item>
                <Breadcrumb.Item href={`/category/${category.slug}`}>
                    {product.category.name}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    {product.name}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={5}>
                    <Figure>
                        <Figure.Image
                            width={400}
                            height={600}
                            alt="171x180"
                            src={`http://localhost:8000/${product.image}`}
                            className="border-image"
                        />
                    </Figure>
                </Col>
                <Col>
                    <h3>{product.name} - <Link className="link-to text-success" to="#"> {product.producer.name}</Link></h3>
                    <p className="time-created"><Moment format="DD/MM/YYYY">{product.created_at}</Moment></p>
                    <div className="inf-area">
                        <p className="cate-info">Loại sản phẩm:<Link to={`/category/${category.slug}`} className="link-to"> {product.category.name}</Link></p>
                        {/* <p className="brand-info">Brand: <Link to="" className="link-to"> Taylor</Link></p> */}
                    </div>
                    <div className='price-area'>
                        <del className="ori-price">Giá gốc: {original_p} VNĐ</del>
                        <p className=" text-danger mt-2">Giá bán: ${selling_p} VNĐ</p>
                    </div>
                    <label className="btn-sm btn-success px-4 mt-2">Còn hàng</label>
                    <br />
                    <label className="btn-sm btn-warning text-quantity mt-2">Còn lại: {product.number}</label>
                    <div className="input-group mt-3 w-25">
                        <button className='input-group-text' onClick={handleDecrement} type="button">-</button>
                        <div className="text-center form-control ">{quantity}</div>
                        <button className='input-group-text' onClick={handleIncrement} type="button">+</button>
                    </div>
                    <Button variant="danger" className="mt-3" onClick={submitAddtoCart}><BsFillCartCheckFill className="mb-1" /> Thêm vào giỏ hàng</Button>
                </Col>
            </Row>
            <hr />
            <div className="desription-text">
                <h4 className="text-uppercase title_category_home">Mô tả</h4>
                <div dangerouslySetInnerHTML={{ __html: product.description }} className="container"></div>
            </div>
            <hr />
            <h4 className="text-uppercase title_category_home">Sản phẩm liên quan</h4>
            <div className="related-area">
                {relatedProduct_HTML}
            </div>
        </div>
    )
}
export default ViewProductDetail;