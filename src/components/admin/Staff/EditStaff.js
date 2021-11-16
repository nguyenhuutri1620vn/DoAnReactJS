import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from "sweetalert2";
function Profile(props) {
    document.title = 'Chingu | Đổi mật khẩu nhân viên';
    const [user, setUser] = useState([]);
    const [error, setError] = useState(true);
    

    const handleInput = (e) => {
        e.persist();
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    useEffect(()=>{
        const user_id = props.match.params.id
        axios.get(`/api/edit-staff/${user_id}`).then(res =>{
            setUser(res.data.staff)
        })
    },[props.match.params.id])

    const UpdateStaff = (e) => {
        e.preventDefault();
        const user_id = props.match.params.id
        const data = {
            newpassword: user.newpassword,
            confirmpassword: user.confirmpassword
        }
        axios.post(`/api/update-staff/${user_id}`, data).then(res=>{
            if (res.data.status === 200) {
                setError([]);
                Swal.fire('Đổi mật khẩu thành công', res.data.message, 'success');
            } else {
                setError(res.data.errors);
            }
        })
    }

    return (
        <div className='container px-4 mt-2'>
            <Card>
                <Card.Header>Đổi mật khẩu</Card.Header>
                <Card.Body>
                <Form className='custom-form-profile' onSubmit={UpdateStaff}>
                    <Form.Group className="mb-3" controlId="formGridpassword">
                        <Form.Label>Tài khoản</Form.Label>
                        <Form.Control type="text" name="username" onChange={handleInput} value={user.username} disabled />
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
            </Card.Body>
        </Card>
        </div >
    )
}
export default Profile;