import axios from "axios";
import React, { useState } from "react";
import swal from 'sweetalert'
import { useHistory } from "react-router";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import bglogin from '../../../assets/frontend/image/background-login.png';
import { Link } from "react-router-dom";


function Register() {

    document.title = "CHINGU | Đăng ký"

    const history = useHistory();
    const [registerInput, setRegister] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        fullname: '',
        email: '',
        phone: '',
        error_list: []
    });
    const [error, setError] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setRegister({ ...registerInput, [e.target.name]: e.target.value })
    }
    const registerSubmit = (e) => {
        e.preventDefault();

        const data = {
            username: registerInput.username,
            password: registerInput.password,
            fullname: registerInput.fullname,
            passwordConfirm: registerInput.passwordConfirm,
            email: registerInput.email,
            phone: registerInput.phone,
        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post(`/api/register`, data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token)
                    localStorage.setItem('auth_name', res.data.username)
                    swal('Đăng ký thành công', res.data.message, 'success');
                    history.push('/');
                    window.location.reload();
                } else {
                    setError(res.data.error);
                }
            });
        });
    }

    return (
        <Container>
            <h1 className='title-login mt-5'>~Đăng ký~</h1>
            <Row>
                <Col className='bg-login'>
                    <img src={bglogin} className='lglogin' alt="logo"/>
                </Col>
                <Col>
                    <div className='input-area'>

                        <Form className='custom-form-register' onSubmit={registerSubmit}>
                            <Row className="mb-3 ">
                                <Form.Group as={Col} controlId="formGridUsername">
                                    <Form.Label>Tên đăng nhập</Form.Label>
                                    <Form.Control type="text" placeholder="Nhập tên đăng nhập.." name='username' onChange={handleInput} value={registerInput.username} />
                                    <small className="text-danger">{error.username}</small>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridFullname">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control type="text" placeholder="" name="Nhập họ và tên.." onChange={handleInput} value={registerInput.fullname} />
                                    <small className="text-danger">{error.fullname}</small>
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGridpassword">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control type="password" placeholder="Nhập mật khẩu.." name="password" onChange={handleInput} value={registerInput.password} />
                                <small className="text-danger">{error.password}</small>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formGridcpassword">
                                <Form.Label>Nhập lại mật khẩu</Form.Label>
                                <Form.Control type="password" placeholder="Nhập lại mật khẩu.." name="passwordConfirm" onChange={handleInput} value={registerInput.passwordConfirm} />
                                <small className="text-danger">{error.passwordConfirm}</small>
                            </Form.Group>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridemail">
                                    <Form.Label>Địa chỉ Email</Form.Label>
                                    <Form.Control type="email" placeholder="Nhập địa chỉ email.." name="email" onChange={handleInput} value={registerInput.email} />
                                    <small className="text-danger">{error.email}</small>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridphone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control type="text" placeholder="Nhập số điện thoại" name="phone" onChange={handleInput} value={registerInput.phone} />
                                    <small className="text-danger">{error.phone}</small>
                                </Form.Group>
                            </Row>
                            <div className="d-grid gap-2">
                                <Button type="submit" size="lg" bsPrefix='btn btn-login'>
                                    <span>Đăng ký</span>
                                </Button>
                                <Button variant="outline-danger btn-gg mb-3">
                                    <img className="img-gg" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                    Đăng nhập bằng Google
                                </Button>
                            </div>
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className='notify-text-account'>Nếu quý khách có tài khoản rồi thì đăng nhập tại <Link to='/login'>đây</Link></p>
                            </Form.Text>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container >
    )
}
export default Register