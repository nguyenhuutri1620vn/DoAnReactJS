import axios from 'axios';
import Rate from 'rc-rate';
import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Card, Dropdown } from 'react-bootstrap';
import { BsFillCartCheckFill } from 'react-icons/bs';
import { Link, useHistory } from 'react-router-dom';
import Slidebar from '../../layouts/frontend/Slidebar';
import { Sort, sortPrice, sortTime, submitAddtoCart } from '../util';

function Search(props) {
    document.title = `Từ khóa ${props.match.params.name}`

    const [product, setProduct] = useState([]);
    const [asc, setAsc] = useState(false);
    const [des, setDes] = useState(false);
    const [newest, setNewest] = useState(true);
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
            product_HTML = product.sort(((a, b) => Sort(a, b, asc, des, newest))).map((item, idx) => {
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
                                    <div className='rate-place'>
                                        <Rate disabled value={item.rate} />
                                        {item.rate === 0 ? <p className="card-user-name small">(Chưa có lượt đánh giá)</p> : null}
                                    </div>
                                    <p className="card-user-name small">Loại sản phẩm: {item.category.name}</p>
                                    <p className="card-user-name small">Thương hiệu: {item.producer.name}</p>
                                    <del className="card-user-name small">Giá gốc: {original_price}</del>
                                    <p className="card-user-name selling-price">Giá bán: {selling_price}</p>
                                </Card.Text>
                                <div className="card-bottom">
                                    <Button variant="danger" onClick={(e) => submitAddtoCart(e, item, quantity, setQuantity, history)}><BsFillCartCheckFill /></Button>
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
                <div className='dropdown-area'>
                    Lọc sản phẩm : 
                    <Dropdown className='float-end dropdown-price'>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            Theo giá
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => sortPrice(e, 'default', setAsc, setDes)}>Mặc định</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => sortPrice(e, 'asc', setAsc, setDes)}>Tăng dần</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => sortPrice(e, 'des', setAsc, setDes)}>Giảm dần</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className='float-end dropdown-price'>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                            Theo thời gian
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={(e) => sortTime(e, 'newest', setNewest, setAsc, setDes)}>Mới nhất</Dropdown.Item>
                            <Dropdown.Item onClick={(e) => sortTime(e, 'oldest', setNewest, setAsc, setDes)}>Cũ nhất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
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