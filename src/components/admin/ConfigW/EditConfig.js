import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { Button } from 'react-bootstrap';

function EditConfig(props) {
    document.title = 'Cấu hình website';

    const [loading, setloading] = useState(true);
    const [configInput, setConfig] = useState([]);
    const [error, setError] = useState([]);

    useEffect(() => {

        axios.get(`/api/edit-config/0`).then(res => {
            if (res.data.status === 200) {
                setConfig(res.data.config);
            } else if (res.data.status === 404) {
                swal('Error', res.data.message, 'error')
            }
            setloading(false);
        });
    }, [props.match.params.id]);

    const handleInput = (e) => {
        e.persist();
        setConfig({ ...configInput, [e.target.name]: e.target.value })
    }

    const configSubmit = (e) => {
        e.preventDefault();

        const data = configInput;

        axios.put(`/api/update-config/0`, data).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success');
                setError([]);
            }
            else if (res.data.status === 422) {
                swal('Warning', 'You need to fill in all the information', 'warning')
                setError(res.data.errors)
            } else if (res.data.status === 404) {
                swal('Error', res.data.message, 'error')
            }
        })
    }
    if (loading) {
        return <h4>Đang tải cấu hình website, vui lòng đợi....</h4>
    }
    return (
        <div className='container-fluid px-4'>
          
                <h4>Cấu hình Website</h4>
                <div id="emailHelp" className="form-text mb-4">Have a good day.</div>
                <div className="box px-3">
                <form onSubmit={configSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Tên website</label>
                        <input type='text' name='name' onChange={handleInput} value={configInput.name} className='form-control' />
                    </div>
                    <div className='text-danger'>{error.name}</div>
                    <div className="mb-3">
                        <label className="form-label">Châm ngôn</label>
                        <input type='text' name='slogan' onChange={handleInput} value={configInput.slogan} className='form-control' />
                    </div>
                    <div className='text-danger'>{error.slogan}</div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type='text' name='email' onChange={handleInput} value={configInput.email} className='form-control' />
                    </div>
                    <div className='text-danger'>{error.email}</div>
                    <div className="mb-3">
                        <label className="form-label">Điện thoại</label>
                        <input type='text' name='phone' onChange={handleInput} value={configInput.phone} className='form-control' />
                    </div>
                    <div className='text-danger'>{error.phone}</div>
                    <div className="mb-3">
                        <label className="form-label">Địa chỉ</label>
                        <input type='text' name='address' onChange={handleInput} value={configInput.address} className='form-control' />
                    </div>
                    <div className='text-danger'>{error.address}</div>
                    <Button type='submit' variant="outline-primary" className='px-4 mt-2'>Cập nhật</Button>
                </form>
            </div>
        </div>
    )
}

export default EditConfig;