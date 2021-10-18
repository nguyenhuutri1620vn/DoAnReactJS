import axios from "axios";
import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Button, Tab, Tabs } from "react-bootstrap";
import { BsFillCartCheckFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";

import Slidebar from "../../layouts/frontend/Slidebar";

function Product() {

    const [product, setProduct] = useState([]);
    const [loading, setloading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);
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
        return <div className='loading'><h4>Loading...</h4></div>
    } else {
        
        var product_HTML = '';
        product_HTML = product.slice(pagesVisited, pagesVisited + productPerPage).map((item) => {
            
            let original_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.original_price));
            let selling_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.selling_price));
            return (
                <Card className='card-product' key={item.id}>
                    <Link to={`category/${item.category.slug}/${item.id}`} className='link-product'>
                        <Card.Img
                            src={`http://localhost:8000/${item.image}`}
                            className='card-image' />
                        <Card.Body>
                            <Card.Title>{item.name}</Card.Title>
                            <Card.Text className='card-text'>
                                <p className="card-user-name small">Category: {item.category.name}</p>
                                <p className="card-user-name small">Brand: {item.producer.name}</p>
                                <del className="card-user-name small">Original price: ${original_p} </del>
                                <p className="card-user-name selling-price">Only: ${selling_p}</p>
                            </Card.Text>
                            <div className="card-bottom">
                                <Button variant="danger"  onClick={()=>console.log(item.id)}><BsFillCartCheckFill /></Button>
                                <div className="card-watching">Only: {item.number}</div>
                            </div>
                        </Card.Body>
                    </Link>
                </Card>
            )
        });
        var productFeatured_HTML = '';
        productFeatured_HTML = product.slice(pagesVisited, pagesVisited + productPerPage).map((item) => {
            if (item.featured === 1) {
                let original_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.original_price));
                let selling_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.selling_price));
                return (
                    <Card className='card-product' key={item.id}>
                        <Link to={`category/${item.category.slug}/${item.id}`} className='link-product'>
                            <Card.Img
                                src={`http://localhost:8000/${item.image}`}
                                className='card-image' />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text className='card-text'>
                                    <p className="card-user-name small">Category: {item.category.name}</p>
                                    <p className="card-user-name small">Brand: {item.producer.name}</p>
                                    <del className="card-user-name smaill">Original price: ${original_p} </del>
                                    <p className="card-user-name selling-price">Only: ${selling_p}</p>
                                </Card.Text>
                                <div className="card-bottom">
                                    <Button variant="danger"><BsFillCartCheckFill /></Button>
                                    <div className="card-watching">Only: {item.number}</div>
                                </div>
                            </Card.Body>
                        </Link>
                    </Card>
                )
            }
        });
        var productPopular_HTML = '';
        productPopular_HTML = product.slice(pagesVisited, pagesVisited + productPerPage).map((item) => {
            if (item.popular === 1) {
                let original_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.original_price));
                let selling_p = new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(parseInt(item.selling_price));
                return (
                    <Card className='card-product' key={item.id}>
                        <Link to={`category/${item.category.slug}/${item.id}`} className='link-product'>
                            <Card.Img
                                src={`http://localhost:8000/${item.image}`}
                                className='card-image' />
                            <Card.Body>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text className='card-text'>
                                    <p className="card-user-name small">Category: {item.category.name}</p>
                                    <p className="card-user-name small">Brand: {item.producer.name}</p>
                                    <del className="card-user-name smaill">Original price: ${original_p} </del>
                                    <p className="card-user-name selling-price">Only: ${selling_p}</p>
                                </Card.Text>
                                <div className="card-bottom">
                                    <Button variant="danger"><BsFillCartCheckFill /></Button>
                                    <div className="card-watching">Only: {item.number}</div>
                                </div>
                            </Card.Body>
                        </Link>
                    </Card>
                )
            }
        });
    }



    return (
        <div className='container product-home'>
            <Slidebar />
            <div className='container product-container'>
                <Breadcrumb>
                    <Breadcrumb.Item href="/product" className='link-product'>
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="/product">
                        Product
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Tabs defaultActiveKey="featured" id="uncontrolled-tab-example" className="mb-3 tab-title">
                    <Tab eventKey="featured" title="Featured">
                        <div className='featured_product'>
                            <div className='box_category_home'>
                                <div className="cards-product">

                                    {productFeatured_HTML}

                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="popular" title="Popular">
                        <div className='featured_product'>
                            <div className='box_category_home'>
                                <div className="cards-product">

                                    {productPopular_HTML}

                                </div>
                            </div>
                        </div>
                    </Tab>
                    <Tab eventKey="default" title="Default">
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
                    previousLabel={'Prev'}
                    nextLabel={'Next'}
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