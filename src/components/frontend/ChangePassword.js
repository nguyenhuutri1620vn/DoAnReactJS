import axios from 'axios';
import React, { useState } from 'react';
import { Breadcrumb, Col, Form, ListGroup, Row, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';


function ChangePassword() {
    document.title = "CHINGU | Đổi mật khẩu"
    const [user, setUser] = useState([]);
    const [error, setError] = useState([]);
    const history = useHistory();

    if (!localStorage.getItem('auth_token')) {
        swal("Thông báo", "Đăng nhập để tiếp tục", 'error');
        history.push('/login');
    }

    const handleInput = (e) => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const submitChangepassword = (e) => {
        e.preventDefault();

        const data = {
            currentpassword: user.currentpassword,
            newpassword: user.newpassword,
            confirmpassword: user.confirmpassword
        }

        axios.post(`/api/change-password`, data).then(res => {
            if (res.data.status === 200) {
                setError([]);
                swal('Đổi mật khẩu thành công', res.data.message, 'success');
            } else if (res.data.status === 422) {
                setError(res.data.error);
            } else if (res.data.status === 419) {
                history.push('/login');
            }
        })
    }

    return (
        <div className="container mt-2 mb-2">
            <Breadcrumb>
                <Breadcrumb.Item href="/product" className='link-product'>
                    Trang chủ
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Đổi mật khẩu
                </Breadcrumb.Item>
                <Breadcrumb.Item >
                    {user.fullname}
                </Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={3}>
                    <ListGroup defaultActiveKey="#link1">
                        <ListGroup.Item action href={`/profile`}>
                            Thông tin cá nhân
                        </ListGroup.Item>
                        <ListGroup.Item action href={`/change-password`} disabled>
                        Đổi mật khẩu
                        </ListGroup.Item>
                        <ListGroup.Item action href={`/order-history`}>
                            Lịch sử đơn hàng
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col>
                    <Form className='custom-form-profile' onSubmit={submitChangepassword}>
                        <Form.Group className="mb-3" controlId="formGridpassword">
                            <h4>Đổi mật khẩu</h4>
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu hiện tại..." name="currentpassword" onChange={handleInput} value={user.currentpassword} />
                            <small className="text-danger">{error.currentpassword}</small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGridcpassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control type="password" placeholder="Nhập mật khẩu mới...." name="newpassword" onChange={handleInput} value={user.newpassword} />
                            <small className="text-danger">{error.newpassword}</small>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGridcpassword">
                            <Form.Label>Cập nhật mật khẩu</Form.Label>
                            <Form.Control type="password" placeholder="Nhập lại mật khẩu mới..." name="confirmpassword" onChange={handleInput} value={user.confirmpassword} />
                            <small className="text-danger">{error.confirmpassword}</small>
                        </Form.Group>
                        <Button type="submit" variant="outline-dark">
                            <span>Cập nhật</span>
                        </Button>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
export default ChangePassword