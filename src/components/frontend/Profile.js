import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, ListGroup, Row, Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';


function Profile() {
    document.title = "CHINGU | Profile"


    const [user, setUser] = useState([]);
    const [loading, setloading] = useState(true);
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [errorlist, setError] = useState([]);
    const history = useHistory();

    if (!localStorage.getItem('auth_token')) {
        swal("Thông báo", "Đăng nhập để tiếp tục", 'error');
        history.push('/login');
    }

    const selectDistrict = (e) => {
        e.persist();
        user.districtID = e.target.value;
    }

    const selectProvince = (e) => {
        e.persist();
        const province_id = e.target.value;
        user.provinceID = province_id;
        axios.post(`/api/select-district/${province_id}`).then(res => {
            if (res.data.status === 200) {
                setDistrict(res.data.district);
            } else {
                console.log("failed");
            }
        })
    }
    console.log(user.districtID);
    useEffect(() => {
        axios.get(`api/allprovince`).then(res => {
            if (res.data.status === 200) {
                setProvince(res.data.province);
            }
        });

        axios.get(`/api/alldistict/${user.provinceID}`).then(res => {
            if (res.data.status === 200) {
                setDistrict(res.data.district);
            }
        })

        axios.get(`/api/getUser`).then(res => {
            if (res.data.status === 200) {
                setUser(res.data.user);
                setloading(false);
            } else if (res.data.status === 401) {
                console.log("Out");
            }
        })
    }, [history, user.provinceID]);
    const updateSubmit = (e) => {
        e.preventDefault();

        const data = {
            email: user.email,
            fullname: user.fullname,
            phone: user.phone,
            provinceID: user.provinceID,
            districtID: user.districtID,
            address: user.address,
        }

        axios.post(`/api/update-profile`, data).then(res => {
            if (res.data.status === 200) {
                swal('Cập nhật thành công', res.data.message, 'success');
                setError([]);
            } else {
                if (res.data.status === 422) {
                    setError(res.data.errors);
                }
            }
        })

    }

    const handleInput = (e) => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value })
    }


    if (loading) {
        return <div className="loading"><h4>Đang tải thông tin khách hàng...</h4></div>
    }

    return (
        <div className="container mt-2 mb-2">
            <Breadcrumb>
                <Breadcrumb.Item href="/product" className='link-product'>
                    Trang chủ
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Thông tin cá nhân
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    {user.fullname}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={3}>
                    <ListGroup defaultActiveKey="#link1">
                        <ListGroup.Item action href={`/profile`} disabled>
                            Thông tin cá nhân
                        </ListGroup.Item>
                        <ListGroup.Item action href={`/change-password`} >
                            Đổi mật khẩu
                        </ListGroup.Item>
                        <ListGroup.Item action href={`/order-history`}>
                            Lịch sử đơn hàng
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col>
                    <Form className='custom-form-profile' onSubmit={updateSubmit}>
                        <h4>Cập nhật thông tin</h4>
                        <Row className="mb-3 ">
                            <Form.Group as={Col} controlId="formGridUsername">
                                <Form.Label>Tên đăng nhập</Form.Label>
                                <Form.Control type="text" placeholder="Enter username" name='username' onChange={handleInput} value={user.username} disabled />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridFullname">
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control type="text" placeholder="Enter full name" name="fullname" onChange={handleInput} value={user.fullname} />
                            </Form.Group>
                            <small className="text-danger">{errorlist.fullname}</small>

                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridemail">
                                <Form.Label>Địa chỉ Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email address" name="email" onChange={handleInput} value={user.email} />
                            </Form.Group>
                            <small className="text-danger">{errorlist.email}</small>

                            <Form.Group as={Col} controlId="formGridphone">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control type="text" placeholder="Enter phone number" name="phone" onChange={handleInput} value={user.phone} />
                            </Form.Group>
                        </Row>
                        <small className="text-danger">{errorlist.phone}</small>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Thành phố</Form.Label>
                                <Form.Select name="provinceID" value={user.provinceID}
                                    onChange={selectProvince}>
                                    <option>Chọn...</option>
                                    {
                                        province.map((item) => {
                                            return (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        })
                                    };
                                </Form.Select>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Huyện</Form.Label>
                                <Form.Select name="districtID" value={user.districtID} onChange={selectDistrict}>
                                    <option>Chọn...</option>
                                    {
                                        district.map((item) => {
                                            return (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="formGridAddress">
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control placeholder="Số nhà - phường  - xã" type="text"
                                value={user.address} name="address" onChange={handleInput} />
                            <small className="text-danger">{errorlist.address}</small>
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button type="submit" variant="outline-dark">
                                <span>Cập nhật</span>
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
export default Profile;