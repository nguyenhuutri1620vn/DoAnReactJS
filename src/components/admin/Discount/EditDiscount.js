import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Button, Card } from 'react-bootstrap';

function EditDiscount(props){
    document.title = 'Chỉnh sửa mã giảm giá';

    const [discount, setDiscount] = useState({
        name: '',
        percent: '',
        status: ''
    });
    const [allCheckbox, setCheckbox] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setDiscount({ ...discount, [e.target.name]: e.target.value });
    }

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    useEffect(() => {
        const discount_id = props.match.params.id;
        axios.get(`/api/edit-discount/${discount_id}`).then(res => {
            if (res.data.status === 200) {
                setDiscount(res.data.discount);
                setCheckbox(res.data.discount);
            } else if (res.data.status === 404) {
                Swal.fire('Thông báo', res.data.message, 'error');
                history.push('/admin/view-discounts')
            }
            setLoading(false);
        })
    }, [props.match.params.id, history])

    const updateDiscount = (e) => {
        e.preventDefault();

        const formData = new FormData();

        const discount_id = props.match.params.id;

        formData.append('name', discount.name);
        formData.append('percent', discount.percent);

        formData.append('status', allCheckbox.status === true ? "1" : "0");


        axios.post(`/api/update-discount/${discount_id}`, formData).then(res => {
            if (res.data.status === 200) {
                Swal.fire('Chỉnh sửa thành công', res.data.message, 'success');
                history.push('/admin/view-discounts');
                setError([]);
            } else if (res.data.status === 422) {
                Swal.fire('Kiểm tra dữ liệu nhập', '', 'error');
                setError(res.data.errors);
            } else if (res.data.status === 404) {
                Swal.fire('Error', res.data.message, 'error');
                history.push('/admin/view-discount');
            }
        })
    }

    if (loading) {
        <h3>Đang tải trang chỉnh sửa thương hiệu, vui lòng đợi...</h3>
    }
    console.log(allCheckbox.status);
    return(
        <div className='container-fluid px-4'>
            <h2 className='mt-4'>Cập nhật mã giảm giá</h2>
            <Card>
                <Card.Body>
                    <form onSubmit={updateDiscount} id="DISCOUNT_FORM">
                        <div className='form-group mb-3'>
                            <label>Tên mã giảm giá</label>
                            <input type='text' name='name' placeholder="Nhập tên mã giảm giá..." onChange={handleInput} value={discount.name} className='form-control' />
                        </div>
                        <small className='text-danger'>{error.name}</small>
                        <div className='form-group mb-3'>
                            <label>Phần trăm giảm giá</label>
                            <input type='text' name='percent' onChange={handleInput} placeholder="Nhập phần trăm giảm giá..." value={discount.percent} className='form-control' />
                        </div>
                        <small className='text-danger'>{error.percent}</small>
                        <div className='form-group mb-3'>
                            <label>Trạng thái</label>
                            <input type='checkbox' name='status' className='form-check-input ms-5' id="flexCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true : false} />
                            <label className="form-check-label " htmlFor="flexCheckChecked">
                                Hiện
                            </label>
                        </div>
                        <Button type='submit' variant="outline-primary" size="xs">Cập nhật</Button>
                    </form>
                </Card.Body>
            </Card>
        </div >
    )
}
export default EditDiscount