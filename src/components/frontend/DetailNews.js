import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Figure, Col, Row } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import Moment from 'react-moment';
import image from '../../assets/frontend/image/background1.png'

function DetailNews(props) {

    const [content, setContent] = useState([]);
    const [relatedConent, setRelatedContent] = useState([]);
    const [loading, setloading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        document.title = `ChinguMusic | ${content.name}`

        const content_id = props.match.params.content;
        axios.get(`/api/detailcontent/${content_id}`).then(res => {
            if (res.data.status === 200) {
                setContent(res.data.content);
                setRelatedContent(res.data.related_content);
            }
            setloading(false);
        })
    }, [props.match.params.id, history])

    if (loading) {
        return <div className="loading"><h4>Loading...</h4></div>
    } else {
        var content_HTML = '';
        content_HTML = relatedConent.slice(0, 4).map((item, idx) => {
            return (
                <Row className="related_news" key={idx}>
                    <Link className="link-to-default" to={`/news/${item.id}`}>
                        <Figure>
                            <Figure.Image alt={item.name} src={`http://localhost:8000/${item.image}`} />
                        </Figure>
                        <div className="content-related-news ">
                            <p className="time-created text-uppercase">{item.name}</p>
                        </div>
                    </Link>
                    <hr/>
                </Row>
            )
        })
    }


    return (
        <div className="container">
            <Breadcrumb className="mb-3 mt-3">
                <Breadcrumb.Item href="/product">
                    Home
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/news">
                    News
                </Breadcrumb.Item>
                <Breadcrumb.Item href="#">
                    {content.name}
                </Breadcrumb.Item>
            </Breadcrumb>
            <div className="content-news mt-2">
                <Row>
                    <Col xs={10}>
                        <div className="title-content-news">
                            <h4 className="text-uppercase">{content.name}</h4>
                            <p className="time-created"><Moment format="DD/MM/YYYY">{content.created_at}</Moment></p>
                        </div>
                        <hr />
                        <div className="content-news">
                            <div className="image-content-news">
                                <Figure>
                                    <Figure.Image
                                        alt={content.name}
                                        src={`http://localhost:8000/${content.image}`}
                                        className="border image-content text-center"
                                    />
                                </Figure>
                            </div>
                            <div className="info-content">
                                <div dangerouslySetInnerHTML={{ __html: content.description }}></div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <p className="text-uppercase title_related_news small">NEWS OTHER</p>
                        {content_HTML}
                    </Col>
                </Row>
            </div>
        </div >
    )
}
export default DetailNews;