import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card , Button, Dropdown, Breadcrumb} from 'react-bootstrap';
import { BsFillCartCheckFill } from 'react-icons/bs';
import ReactPaginate from 'react-paginate';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Slidebar from '../../layouts/frontend/Slidebar';

function ProductFeatured() {
    document.title = "Chingu | Sản phẩm nổi bật"

    const [productFeatured, setProductFeatured] = useState([]);

    const [loading, setloading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const history = useHistory();
    const productPerPage = 12;
    const pagesVisited = pageNumber * productPerPage;

    const pageCount = Math.ceil(productFeatured.length / productPerPage);

    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        axios.get(`/api/product`).then(res => {
            if (res.data.status === 200) {
                setProductFeatured(res.data.product_featured)
            }
            setloading(false);
        });
    }, [])

    if (loading) {
        return <div className='loading'><h4>Đang tải sản phẩm...</h4></div>
    } else {
        var productFeatured_HTML = '';
        productFeatured_HTML = productFeatured.sort(function () { return 0.5 - Math.random() }).slice(pagesVisited, pagesVisited + productPerPage).map((item) => {
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
                                <del className="card-user-name small">Giá gốc: {original_p}</del>
                                <p className="card-user-name selling-price">Giá bán: {selling_p}</p>
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
                        Sản phẩm nổi bật
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        Xem sản phẩm
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="/product">Mặc định</Dropdown.Item>
                        <Dropdown.Item href="/product-featured">Nổi bật</Dropdown.Item>
                        <Dropdown.Item href="/product-popular">Phổ biến</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className='featured_product'>
                    <div className='box_category_home'>
                        <div className="cards-product">
                            {productFeatured_HTML}
                        </div>
                    </div>
                </div>

                <ReactPaginate
                    previousLabel={'←'}
                    nextLabel={'→'}
                    pageCount={pageCount}
                    onPageChange={handleChangPage}
                    containerClassName={"paginationBttns"}
                    previousLinkClassName={"previousBttn"}
                    nextLinkClassName={"nextBttn"}
                    disabledClassName={"p0aginationDisable"}
                    activeClassName={"paginationActive"}
                >
                </ReactPaginate>
            </div>
        </div>
    )
}
export default ProductFeatured