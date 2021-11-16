import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Button, Tab, Tabs } from "react-bootstrap";
import { BsFillCartCheckFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";

import Slidebar from "../../layouts/frontend/Slidebar";


function Product() {
    document.title = "Chingu | Sản phẩm"

    const [product, setProduct] = useState([]);
    const [loading, setloading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const history = useHistory();
    const productPerPage = 12;
    const pagesVisited = pageNumber * productPerPage;

    const pageCount = Math.ceil(product.length / productPerPage);

    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        axios.get(`/api/product`).then(res => {
            if (res.data.status === 200) {
                setProduct(res.data.product)
            }
            setloading(false);
        });
    }, [])
    if (loading) {
        return <div className='loading'><h4>Đang tải sản phẩm...</h4></div>
    } else {

        var product_HTML = '';
        product_HTML = product.sort(function() {return 0.5 - Math.random()}).slice(pagesVisited, pagesVisited + productPerPage).map((item) => {
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
                                <del className="card-user-name small">Giá gốc: {original_p} VNĐ</del>
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
        });
        var productFeatured_HTML = '';
        productFeatured_HTML = product.slice(pagesVisited, pagesVisited + productPerPage).sort(function() {return 0.5 - Math.random()}).map((item) => {
            if (item.featured === 1) {
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
                let selling_p = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.selling_price);
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
                                    <del className="card-user-name small">Giá gốc: {original_p} VNĐ</del>
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
            } else {
                return null
            }
        });
        var productPopular_HTML = '';
        productPopular_HTML = product.slice(pagesVisited, pagesVisited + productPerPage).sort(function() {return 0.5 - Math.random()}).map((item) => {
            if (item.popular === 1) {
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
                let original_price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price);
                let selling_price = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.selling_price);
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
                                    <del className="card-user-name small">Giá gốc: {original_price} VNĐ</del>
                                    <p className="card-user-name selling-price">Giá bán: {selling_price} VNĐ</p>
                                </Card.Text>
                                <div className="card-bottom">
                                    <Button variant="danger" onClick={submitAddtoCart}><BsFillCartCheckFill /></Button>
                                    <div className="card-watching">Chỉ còn: {item.number}</div>
                                </div>
                            </Card.Body>
                        </Link>
                    </Card>
                )
            }
            else {
                return null
            }
        });
    }
    return (
        <div className='container product-home'>
            <Slidebar />
            <div className='container product-container'>
                <Breadcrumb>
                    <Breadcrumb.Item href="/product" className='link-product'>
                        Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/product">
                        Sản phẩm
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Tabs defaultActiveKey="featured" id="uncontrolled-tab-example" className="mb-3 tab-title">
                    <Tab eventKey="featured" title="Nổi bật">
                        <div className='featured_product'>
                            <div className='box_category_home'>
                                <div className="cards-product">
                                    {productFeatured_HTML}
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="popular" title="Phổ biến">
                        <div className='featured_product'>
                            <div className='box_category_home'>
                                <div className="cards-product">
                                    {productPopular_HTML}
                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="default" title="Mặc định">
                        <div className='featured_product'>
                            <div className='box_category_home'>
                                <div className="cards-product">

                                    {product_HTML}

                                </div>
                            </div>
                        </div>
                    </Tab>
                </Tabs>
                <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={pageCount}
                    onPageChange={handleChangPage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"paginationDisable"}
                    activeClassName={"paginationActive"}
                >
                </ReactPaginate>
            </div>
        </div>
    )
}
export default Product;