import axios from 'axios';
import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';

function AddDiscount() {
    document.title = 'Thêm mã giảm giá';

    const [discountInput, setDiscount] = useState({
        name: '',
        percent: '',
        status: ''
    })
    const [errorlist, setError] = useState([]);
    const [allCheckbox, setCheckbox] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setDiscount({ ...discountInput, [e.target.name]: e.target.value });
    }
    const submitDiscount = (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        formData.append('name', discountInput.name);
        formData.append('percent', discountInput.percent);
        formData.append('status', allCheckbox.status ? 1 : 0);

        axios.post(`/api/add-discount`, formData).then(res => {
            if (res.data.status === 200) {
                Swal.fire('Tạo mã giảm giá thành công', res.data.message, 'success')
                setError([]);
            } else if (res.data.status === 400) {
                Swal.fire('Kiểm tra dữ liệu nhập', '', 'error');
                setError(res.data.errors);
            }
        })
    }
    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }
    return (
        <div className='container-fluid px-4'>
            <h2 className='mt-4'>Thêm mã giảm giá</h2>
            <Card>
                <Card.Body>
                    <form onSubmit={submitDiscount} id="DISCOUNT_FORM">
                        <div className='form-group mb-3'>
                            <label>Tên mã giảm giá</label>
                            <input type='text' name='name' placeholder="Nhập tên mã giảm giá..." onChange={handleInput} value={discountInput.name} className='form-control' />
                        </div>
                        <small className='text-danger'>{errorlist.name}</small>
                        <div className='form-group mb-3'>
                            <label>Phần trăm giảm giá</label>
                            <input type='text' name='percent' onChange={handleInput} placeholder="Nhập phần trăm giảm giá..." value={discountInput.percent} className='form-control' />
                        </div>
                        <small className='text-danger'>{errorlist.percent}</small>
                        <div className='form-group mb-3'>
                            <label>Trạng thái</label>
                            <input type='checkbox' name='status' className='form-check-input ms-5' id="flexCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true : false} />
                            <label className="form-check-label " htmlFor="flexCheckChecked">
                                Hiện
                            </label>
                        </div>
                        <Button type='submit' variant="outline-primary" size="xs">Thêm</Button>
                    </form>
                </Card.Body>
            </Card>
        </div >
    )
}
export default AddDiscount