import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Breadcrumb, Button, Card, Col, Figure, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import Moment from 'react-moment';
import { BsFillCartCheckFill } from 'react-icons/bs';
import ReactPlayer from 'react-player'
import Rate from 'rc-rate';
import 'rc-rate/assets/index.css';
import ReactPaginate from 'react-paginate';
import { submitAddtoCart } from '../util';


function ViewProductDetail(props) {
    const [category, setCategory] = useState([]);
    const [product, setProduct] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [relatedProduct, setRelatedProduct] = useState([]);
    const [error, setError] = useState([]);
    const [enableComment, setEnableComment] = useState([]);
    const [loading, setloading] = useState(true);
    const [commentList, setCommentList] = useState([])
    const [rate, setRate] = useState(5)
    const [quantity, setQuantity] = useState(1);
    const [comment, setComment] = useState({
        userID: '',
        productID: '',
        content: '',
        detail: '',
        rate: 5
    })
    const history = useHistory();

    const commentPerPage = 5;
    const pagesVisited = pageNumber * commentPerPage;
    const pageCount = Math.ceil(commentList.length / commentPerPage);
    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    document.title = `ChingMusic | ${product.name}`;

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prevCount => prevCount - 1);
        }
    }
    const handleIncrement = () => {
        if (quantity < product.number)
            setQuantity(prevCount => prevCount + 1);
    }

    useEffect(() => {
        let isMounterd = true;
        const category_slug = props.match.params.category;
        const product_id = props.match.params.product;

        axios.get(`/api/viewproductdetail/${category_slug}/${product_id}`).then(res => {
            if (isMounterd) {
                if (res.data.status === 200) {
                    setProduct(res.data.product);
                    setCategory(res.data.category);
                    setRelatedProduct(res.data.related_product);
                    setloading(false);
                } else if (res.data.status === 404) {
                    history.push('/product');
                    Swal.fire('Th??ng b??o', res.data.message, 'error');
                }
            }
        })
        return () => {
            isMounterd = false;
        }
    }, [props.match.params.category, props.match.params.product, history, product.name])

    useEffect(() => {
        const product_id = props.match.params.product;
        axios.get(`/api/list-comment/${product_id}`).then(res => {
            if (res.data.status === 200) {
                setCommentList(res.data.listcomment);
                setEnableComment(res.data.getorderdetail);
            }
        })
    }, [props.match.params.product])
    function quantity_HTML() {
        if (product.quantity <= 0) {
            return (
                <label className="btn-sm btn-danger px-4 mt-2">H???t h??ng</label>
            )
        } else {
            return (
                <label className="btn-sm btn-success px-4 mt-2">C??n h??ng</label>
            )
        }
    }
    const onChangeComment = (e) => {
        e.persist()
        setComment({ ...comment, [e.target.name]: e.target.value })
    }

    const onChangeRate = (e) => {
        setRate(e)
    }
    const submitComment = (e) => {
        e.preventDefault()
        const formData = new FormData();

        formData.append('content', comment.content)
        formData.append('detail', comment.detail)
        formData.append('rate', rate)

        const product_id = props.match.params.product;

        axios.post(`/api/add-comment/${product_id}`, formData).then(res => {
            if (res.data.status === 200) {
                Swal.fire('B??nh lu???n s???n ph???m th??nh c??ng', res.data.message, 'success')

                setError([])
            } else if (res.data.status === 201) {
                Swal.fire('S???n ph???m n??y ???? ???????c b??nh lu???n', res.data.message, 'warning')
                setError([]);
            } else if (res.data.status === 400) {
                Swal.fire('Ki???m tra d??? li???u nh???p', '', 'error');
                setError(res.data.errors);
            }
        })

    }
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
    if (loading) {
        return <div className='loading'><h4>??ang t???i, vui l??ng ?????i...</h4></div>
    } else {
        var relatedProduct_HTML = '';
        relatedProduct_HTML = relatedProduct.sort(function () { return 0.5 - Math.random() }).slice(0, 4).map((item, idx) => {
            if (item.id !== product.id) {
                let original_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.original_price);
                let selling_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.selling_price);

                return (
                    <Card className='card-product-related mx-2' key={idx}>
                        <Link to={`/category/${item.category.slug}/${item.id}`} className='link-product'>
                            <Card.Img
                                src={`http://localhost:8000/${item.image}`}
                                className='card-image' />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text className='card-text'>
                                    <del className="card-user-name smaill">Gi?? g???c: {original_p}</del>
                                    <p className="card-user-name selling-price">Gi?? b??n: ${selling_p}</p>
                                </Card.Text>
                            </Card.Body>
                        </Link>
                    </Card>
                )
            } else if (relatedProduct.length - 1 === 0) {
                return <h4 className="non-related text-uppercase mt-3 text-center">Kh??ng c?? s???n ph???m li??n quan</h4>;
            } else {
                return null;
            }
        });
    }
    let original_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.original_price);
    let selling_p = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.selling_price);
    return (
        <div className='container mt-2'>
            <Breadcrumb className="mb-2">
                <Breadcrumb.Item href="/product">
                    Trang ch???
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
                    <Rate disabled value={Math.round(product.rate)} />({commentList.length} l?????t ????nh gi??)
                    <div className="inf-area">
                        <p className="cate-info">Lo???i s???n ph???m:<Link to={`/category/${category.slug}`} className="link-to"> {product.category.name}</Link></p>
                    </div>
                    <div className='price-area'>
                        {product.discountID !== 1 ? <div> <del className="ori-price">Gi?? g???c: {original_p}</del>
                            <p className=" text-danger mt-2">Gi?? b??n: ${selling_p}</p></div> :
                            <p className=" text-danger mt-2">Gi?? b??n: ${selling_p}</p>}
                    </div>
                    {quantity_HTML()}
                    <br />
                    <label className="btn-sm btn-warning text-quantity mt-2">C??n l???i: {product.number}</label>
                    <div className="input-group mt-3 w-25">
                        <button className='input-group-text' onClick={handleDecrement} type="button">-</button>
                        <div className="text-center form-control ">{quantity}</div>
                        <button className='input-group-text' onClick={handleIncrement} type="button">+</button>
                    </div>
                    <Button variant="danger" className="mt-3" onClick={(e) => submitAddtoCart(e, product, quantity, setQuantity, history)}><BsFillCartCheckFill className="mb-1" /> Th??m v??o gi??? h??ng</Button>
                </Col>
            </Row>
            <hr />
            <div className="desription-text">
                <h4 className="text-uppercase title_category_home">M?? t???</h4>
                <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                    <Tab eventKey="home" title="Th??ng tin s???n ph???m">
                        <div dangerouslySetInnerHTML={{ __html: product.description }} className="container"></div>
                    </Tab>
                    <Tab eventKey="video" title="Video">
                        <div>
                            <ReactPlayer url={product.video} width='1120px' height='500px' />
                        </div>
                    </Tab>
                </Tabs>

            </div>
            <div>
                {enableComment.indexOf(parseInt(props.match.params.product)) !== -1 ?
                    <div className="product-comment">
                        <h3>B??nh lu???n</h3>
                        <Form className='mt-3' onSubmit={submitComment}>
                            <Form.Group className="mb-3">
                                <Form.Label>Ti??u ?????</Form.Label>
                                <Form.Control
                                    placeholder="Nh???p ti??u ?????"
                                    name="content"
                                    value={comment.content}
                                    onChange={onChangeComment} />
                            </Form.Group>
                            <div className='text-danger'>{error.content}</div>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label><b>N???i dung</b></Form.Label>
                                <Form.Control
                                    placeholder="Nh???p n???i dung b??nh lu???n"
                                    as="textarea"
                                    rows={3}
                                    name='detail'
                                    onChange={onChangeComment}
                                    value={comment.detail} />
                            </Form.Group>
                            <div className='text-danger'>{error.detail}</div>
                            <div className='product-rate'>
                                <p><b>????nh gi?? s???n ph???m</b></p>
                                <Rate
                                    onChange={onChangeRate}
                                    value={rate}
                                />
                            </div>
                            <div className='text-danger'>{error.rate}</div>
                            <Button type='submit' variant="outline-primary" className='mt-2'>????ng</Button>
                        </Form>

                    </div> : <div className="no-sold-product-comment">
                        <Alert variant="warning">
                            B???n kh??ng th??? b??nh lu???n v?? ch??a mua s???n ph???m n??y
                        </Alert>
                    </div>
                }
                <div className='comment-list mt-3'>
                    <h4 className='text-danger'>Danh s??ch b??nh lu???n s???n ph???m (c?? {commentList.length} l?????t b??nh lu???n)</h4>
                    <div className='content-comment-list-area'>

                        {commentList.length ?
                            commentList.slice(pagesVisited, pagesVisited + commentPerPage).map((item) => {
                                return (
                                    <div key={item.id}>
                                        <div className='user-name-comment'>{item.users.fullname}</div>
                                        <div className='content-comment-list'>{item.content}</div>
                                        <div className='detail-comment-list'>{item.detail}</div>
                                        <Rate value={item.rate} disabled />
                                        <div className='time-commet'>{formatDate(item.created_at)}</div>
                                        <hr />
                                    </div>
                                )
                            }) : <div>Hi???n t???i ch??a c?? b??nh lu???n n??o</div>}
                        {commentList.length > 5 ? <ReactPaginate
                            disabledClassName={"pagination__link--disabled"}
                            previousLabel={'???'}
                            nextLabel={'???'}
                            pageCount={pageCount}
                            onPageChange={handleChangPage}
                            containerClassName={"paginationBttns"}
                            previousLinkClassName={"paginationPN"}
                            nextLinkClassName={"paginationPN"}
                            activeClassName={"paginationActive"}
                        >
                        </ReactPaginate> : <div></div>}

                    </div>
                </div>

            </div>
            <hr />
            <h4 className="text-uppercase title_category_home">S???n ph???m li??n quan</h4>
            <div className="related-area mt-2 mb-2">
                {relatedProduct_HTML}
            </div>
        </div>
    )
}
export default ViewProductDetail;