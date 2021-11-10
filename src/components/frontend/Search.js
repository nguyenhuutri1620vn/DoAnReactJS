import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card } from 'react-bootstrap';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Slidebar from '../../layouts/frontend/Slidebar';

function Search(props) {
    document.title = `Từ khóa ${props.match.params.name}`

    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const productCount = product.length;
    const history = useHistory();
    useEffect(() => {
        let isMounterd = true;
        const search_name = props.match.params.name;
        axios.get(`/api/search/${search_name}`).then(res => {
            if (isMounterd) {
                if (res.data.status === 200) {
                    setProduct(res.data.product);
                } else {
                    console.log('fails');
                }
                setLoading(false)
            }
        });
        return () => {
            isMounterd = false;
        }
    }, [props.match.params.name, history])

    if (loading) {
        return (
            <div className='container loading'><h4>Đang tìm sẩm phẩm...</h4></div>
        )
    } else {
        var product_HTML = ''
        if (productCount) {
            product_HTML = product.map((item, idx) => {
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
            })
        } else {
            product_HTML =
                <div className="mx-4">
                    <h4>Không tìm thấy sản phẩm với thừ khóa {props.match.params.name}</h4>
                </div>
        }
    }
    return (
        <div className='container product-home'>
            <Slidebar />
            <div className='container product-container'>
                <Breadcrumb>
                    <Breadcrumb.Item href="/home" className='link-product'>
                        Trang chủ
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/product">
                        Sản phẩm
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Tìm kiếm với từ khóa '{props.match.params.name}'
                    </Breadcrumb.Item>
                </Breadcrumb>
                <div className='featured_product'>
                    <div className='box_category_home'>
                        <div className="cards-product">
                            {product_HTML}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Search