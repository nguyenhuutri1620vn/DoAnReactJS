import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Figure, Breadcrumb } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';


function News() {
    document.title = "Chingu | Tin tức"

    const [content, setContent] = useState([]);
    const [loading, setloading] = useState(true);
    const [pageNumber, setPageNumber] = useState(0);

    const contentPerPage = 5;
    const pagesVisited = pageNumber * contentPerPage;

    const pageCount = Math.ceil(content.length / contentPerPage);

    const handleChangPage = ({ selected }) => {
        setPageNumber(selected);
    }

    useEffect(() => {
        axios.get(`/api/home`).then(res => {
            if (res.data.status === 200) {
                setContent(res.data.content);
            }
            setloading(false);
        })
    }, [])

    if (loading) {
        return <div className="loading"><h4>Đang tải tin tức...</h4></div>
    } else {
        var content_HTML = '';
        content_HTML = content.slice(pagesVisited, pagesVisited + contentPerPage).map((item, idx) => {
            return (
                <Row key={idx}>
                    <Col xs={3}>
                        <Link to={`/news/${item.id}`}>
                            <Figure>
                                <Figure.Image
                                    width={400}
                                    height={600}
                                    alt={`${item.name}`}
                                    src={`http://localhost:8000/${item.image}`}
                                    className="border image-content"
                                />
                            </Figure>
                        </Link>
                    </Col>
                    <Col>
                        <Link to={`/news/${item.id}`} className="link-to-default">
                            <h4 className="title-content">{item.name}</h4>
                            <div className='descrip-text-content'>
                                <div dangerouslySetInnerHTML={{ __html: item.meta_descrip }}>
                                </div>
                            </div>
                            <Link to={`/news/${item.id}`} className="float-end link-to">Chi tiêt 》</Link>
                        </Link>
                    </Col>
                    <hr />
                </Row>
            )
        })
    }
    return (
        <div className='container mt-4'>
            <Breadcrumb className="mb-2">
                <Breadcrumb.Item href="/product">
                    Trang chủ
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    Tin tức
                </Breadcrumb.Item>
            </Breadcrumb>
            <h4 className="mb-4"> Tin tức - Sự kiện </h4>
            {content_HTML}
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
    )
}
export default News;