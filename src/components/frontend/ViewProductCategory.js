import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Button } from "react-bootstrap";
import { BsFillCartCheckFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import Slidebar from "../../layouts/frontend/Slidebar";

function ViewProductCategory(props) {
    const [product, setProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setloading] = useState(true);
    const history = useHistory();
    const productCount = product.length;

    const productPerPage = 12;
    const pagesVisited = pageNumber * productPerPage;

    const pageCount = Math.ceil(product.length / productPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        let isMounterd = true;

        const product_slug = props.match.params.slug;
        axios.get(`/api/fetchproducts/${product_slug}`).then(res => {
            if (isMounterd) {
                if (res.data.status === 200) {
                    setProduct(res.data.product_data.product);
                    setCategory(res.data.product_data.category);
                } else if (res.data.status === 400) {
                    swal('Thông báo', res.data.message, 'error');
                } else if (res.data.status === 404) {
                    history.push('/product');
                    swal('Thông báo', res.data.message, 'error');
                }
                setloading(false);
            }
        })

        return () => {
            isMounterd = false;
        }
    }, [props.match.params.slug, history])

    if (loading) {
        return <div className='loading'><h4>Vui lòng chờ...</h4></div>
    } else {
        var product_HTML = '';
        if (productCount) {
            product_HTML = product.slice(pagesVisited, pagesVisited + productPerPage).map((item, idx) => {
                let original_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.original_price));
                let selling_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.selling_price));
                return (
                    <Card className='card-product' key={idx}>
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
                                    <Button variant="danger"><BsFillCartCheckFill /></Button>
                                    <div className="card-watching">Chỉ còn: {item.number}</div>
                                </div>
                            </Card.Body>
                        </Link>
                    </Card>
                )
            })
        } else {
            product_HTML =
                <div>
                    <h4>Không có sản phẩm nào là {category.name}</h4>
                </div>
        }
    }

    return (
        <div className='container product-home'>

            <Slidebar />
            <div className='container product-container'>
                <Breadcrumb>
                    <Breadcrumb.Item href="/product" className='link-product'>
                        Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={`../category/${category.slug}`}>
                        {category.name}
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className='featured_product'>
                    <div className='box_category_home'>
                        <div className="cards-product">

                            {product_HTML}

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
                    disabledClassName={"paginationDisable"}
                    activeClassName={"paginationActive"}
                >
                </ReactPaginate>
            </div>
        </div>
    )
}
export default ViewProductCategory;