import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Button } from 'react-bootstrap';

function EditProducer(props) {
    document.title = 'Chỉnh sửa thương hiệu';

    const [producer, setProducer] = useState([]);
    const [allCheckbox, setCheckbox] = useState([]);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setProducer({ ...producer, [e.target.name]: e.target.value });
    }

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    useEffect(() => {
        const product_id = props.match.params.id;
        axios.get(`/api/edit-producer/${product_id}`).then(res => {
            if (res.data.status === 200) {
                setProducer(res.data.producer);
                setCheckbox(res.data.producer);
            } else if (res.data.status === 404) {
                Swal.fire('Error', res.data.message, 'error');
                history.push('/admin/view-producer')
            }
            setLoading(false);
        })
    }, [props.match.params.id, history])

    const updateProducer = (e) => {
        e.preventDefault();

        const formData = new FormData();

        const product_id = props.match.params.id;

        formData.append('name', producer.name);
        formData.append('slug', producer.slug);
        formData.append('description', producer.description);

        formData.append('meta_title', producer.meta_title);
        formData.append('meta_keyword', producer.meta_keyword);
        formData.append('meta_descrip', producer.meta_descrip);

        formData.append('status', allCheckbox.status === true ? "1" : "0");


        axios.post(`/api/update-producer/${product_id}`, formData).then(res => {
            if (res.data.status === 200) {
                Swal.fire('Chỉnh sửa thành công', res.data.message, 'success');
                history.push('/admin/view-producer');
                setError([]);
            } else if (res.data.status === 422) {
                Swal.fire('Kiểm tra dữ liệu nhập', '', 'error');
                setError(res.data.errors);
            } else if (res.data.status === 404) {
                Swal.fire('Error', res.data.message, 'error');
                history.push('/admin/view-producer');
            }
        })
    }

    console.log(allCheckbox.status);

    if (loading) {
        <h3>Đang tải trang chỉnh sửa thương hiệu, vui lòng đợi...</h3>
    }

    return (
        <div className='container px-4'>
            <h2 className='mt-4'>Chỉnh sửa thương hiệu
                <Link to='/admin/view-producer' className='btn btn-danger float-end btn-sm'>Quay về</Link></h2>
            <form onSubmit={updateProducer}>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Thông tin thương hiệu</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                    </li>
                </ul>
                <div className="box">
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane card-body fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div className='form-group mb-3'>
                                <label>Slug</label>
                                <input type='text' name='slug' onChange={handleInput} value={producer.slug} className='form-control' />
                            </div>
                            <small className='text-danger'>{error.slug}</small>
                            <div className='form-group mb-3'>
                                <label>Tên thương hiệu</label>
                                <input type='text' name='name' onChange={handleInput} value={producer.name} className='form-control' />
                            </div>
                            <small className='text-danger'>{error.name}</small>
                            <div className='form-group mb-3'>
                                <label>Mô tả</label>
                                <textarea name='description' onChange={handleInput} value={producer.description} className='form-control' />
                            </div>
                            <div className='form-group mb-3'>
                                <label>Trạng thái</label>
                                <input type='checkbox' name='status' className='form-check-input ms-5' id='flexCheckChecked' onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true : false} />
                                <label className="form-check-label " htmlFor="flexCheckChecked">
                                    Hiện
                                </label>
                            </div>
                        </div>
                        <div className="tab-pane card-body fade" id="seo-tags" role="tabpanel" aria-labelledby="profile-tab">
                            <div className='form-group mb-3'>
                                <label>Meta title</label>
                                <input type='text' name='meta_title' onChange={handleInput} value={producer.meta_title} className='form-control' />
                            </div>
                            <small className='text-danger'>{error.meta_title}</small>
                            <div className='form-group mb-3'>
                                <label>Meta keywords</label>
                                <input type='text' name='meta_keyword' onChange={handleInput} value={producer.meta_keyword} className='form-control' />
                            </div>
                            <div className='form-group mb-3'>
                                <label>Meta description</label>
                                <textarea name='meta_descrip' onChange={handleInput} value={producer.meta_descrip} className='form-control' />
                            </div>
                        </div>
                        <Button type='submit' variant="outline-primary" className='px-4 mx-3'>Cập nhật</Button>
                    </div>
                </div>
            </form>
        </div >
    )
}
export default EditProducer