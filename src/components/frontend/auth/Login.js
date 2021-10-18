import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import bglogin from '../../../assets/frontend/image/background-login.png';


function Login() {

    document.title = "CHINGU | Login"

    const history = useHistory();
    const [loginInput, setLogin] = useState({
        username: '',
        password: '',
        error_list: []
    })

    const handleInput = (e) => {
        e.persist()
        setLogin({ ...loginInput, [e.target.name]: e.target.value })
    }

    const loginSubmit = (e) => {
        e.preventDefault();

        const data = {
            username: loginInput.username,
            password: loginInput.password
        }
        axios.get('/sanctum/csrf-cookie').then(response => {
            axios.post('/api/login', data).then(res => {
                if (res.data.status === 200) {
                    localStorage.setItem('auth_token', res.data.token)
                    localStorage.setItem('auth_name', res.data.username)
                    swal('Success', res.data.message, 'success')
                    history.push('/');
                    if (res.data.role === 'admin') {
                        history.push('/admin/dashboard')
                    } else {

                    }
                } else if (res.data.status === 401) {
                    swal('Warning', res.data.message, 'warning')
                } else {
                    setLogin({ ...loginInput, error_list: res.data.validation_err })
                }

            });
        });
    }

    return (
        <Container>
            <Row>
                <Col>
                    <img src={bglogin} className='lglogin' />
                </Col>
                <Col>
                    <div className='input-area'>
                        <h1 className='title-login'>~LOGIN~</h1>
                        <Form onSubmit={loginSubmit} className='custom-form-register'>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Username"
                                className="mt-3"
                            >
                                <Form.Control type="text" placeholder="username" name='username' onChange={handleInput} value={loginInput.username} />
                            </FloatingLabel>
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className='notifyText text-danger'> {loginInput.error_list.username}</p>
                            </Form.Text>
                            <FloatingLabel controlId="floatingPassword" label="Password">
                                <Form.Control type="password" placeholder="Password" name='password' className="mt-3" onChange={handleInput} value={loginInput.password} />
                            </FloatingLabel>
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className='notifyText text-danger'> {loginInput.error_list.password}</p>
                            </Form.Text>
                            <div className="d-grid gap-2">
                                <Button type="submit" size="lg" bsPrefix='btn btn-login'>
                                    <span>Login</span>
                                </Button>
                                <Button variant="outline-danger btn-gg mb-3">
                                    <img className="img-gg" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                    Login with Google
                                </Button>
                            </div>
                            <Form.Text id="passwordHelpBlock" muted>
                                <p className='notify-text-account'>Do not have an account ? Let <Link to='/register'>Register</Link></p>
                            </Form.Text>
                        </Form>
                    </div>
                </Col>

            </Row>
        </Container >
    )
}
export default Login