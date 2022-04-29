import axios from "axios";
import Rate from "rc-rate";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Button, Dropdown } from "react-bootstrap";
import { BsFillCartCheckFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import Slidebar from "../../layouts/frontend/Slidebar";

function ViewProductCategory(props) {
    const [product, setProduct] = useState([]);
    const [asc, setAsc] = useState(false);
    const [des, setDes] = useState(false);
    const [category, setCategory] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setloading] = useState(true);
    const history = useHistory();
    const [quantity, setQuantity] = useState(1);

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
                    Swal.fire('Thông báo', res.data.message, 'error');
                } else if (res.data.status === 404) {
                    history.push('/product');
                    Swal.fire('Thông báo', res.data.message, 'error');
                }
                setloading(false);
            }
        })

        return () => {
            isMounterd = false;
        }
    }, [props.match.params.slug, history])
    const sortPrice = (e, type) => {
        e.preventDefault()
        switch (type) {
            case 'default':
                setAsc(false)
                setDes(false)
                break;
            case 'asc':
                setAsc(true)
                setDes(false)
                break;
            case 'des':
                setAsc(false)
                setDes(true)
                break;
            default:
                break;
        }
    }
    if (loading) {
        return <div className='loading'><h4>Vui lòng chờ...</h4></div>
    } else {
        var product_HTML = '';
        function PriceSort(a, b) {
            if (asc === true && des === false) {
                return a.selling_price - b.selling_price
            } else if (des === true && asc === false) {
                return b.selling_price - a.selling_price
            } else {
                return b.id - a.id
            }
        }
        if (productCount) {
            product_HTML = product.sort(PriceSort).slice(pagesVisited, pagesVisited + productPerPage).map((item, idx) => {
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
                        {item.discountID !== 1 ? <div className="percent-sale">{item.discount.percent}%</div> : <div></div>}
                        <Link to={`/category/${item.category.slug}/${item.id}`} className='link-product'>
                            <div className="image-product-area">
                                <Card.Img
                                    src={`http://localhost:8000/${item.image}`}
                                    className='card-image' />
                            </div>
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text className='card-text'>
                                    <div className='rate-place'>
                                        <Rate disabled value={item.rate} />
                                        {item.rate === 0 ? <p className="card-user-name small">(Chưa có lượt đánh giá)</p> : null}
                                    </div>
                                    <p className="card-user-name small">Loại sản phẩm: {item.category.name}</p>
                                    <p className="card-user-name small">Thương hiệu: {item.producer.name}</p>
                                    <div className="card-price-area">
                                        {item.discountID !== 1 ? <div><del className="card-user-name">Giá gốc: {original_p} </del>
                                            <p className="card-user-name selling-price">Giá bán: {selling_p}</p></div> :
                                            <p className="card-user-name">Giá bán: {original_p}</p>
                                        }
                                    </div>
                                </Card.Text>
                                <div className="card-bottom">
                                    <Button variant="danger" onClick={submitAddtoCart}><BsFillCartCheckFill /></Button>
                                    <div className="card-watching">Chỉ còn: {item.number}</div>
                                </div>
                            </Card.Body>
                        </Link>
                    </Card >
                )
            })
        } else {
            product_HTML =
                <div className='container'>
                    <h4>Không có sản phẩm nào là {category.name}</h4>
                </div>
        }
    }
    document.title = `CHINGU | ${category.name}`

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
                Lọc sản phẩm: 
                <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                        Theo giá
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={(e) => sortPrice(e, 'default')}>Mặc định</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => sortPrice(e, 'asc')}>Tăng dần</Dropdown.Item>
                        <Dropdown.Item onClick={(e) => sortPrice(e, 'des')}>Giảm dần</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
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