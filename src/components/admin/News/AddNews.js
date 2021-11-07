import React, { useState } from "react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from "axios";
import swal from "sweetalert";
import { Button } from 'react-bootstrap';


function AddNews() {
    document.title = 'Tạo tin tức';

    const [picture, setPicture] = useState([]);
    const [errorlist, setError] = useState([]);
    const [newsInput, setNews] = useState({
        name: '',
        description: '',

        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',

    });
    const [allCheckbox, setCheckbox] = useState([]);

    const handleImage = (e) => {
        e.persist();
        setPicture({ image: e.target.files[0] });
    }
    const handleInput = (e) => {
        e.persist();
        setNews({ ...newsInput, [e.target.name]: e.target.value });
    }

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    const handleDescrip = (e, editor) => {
        const data = editor.getData();
        setNews({ ...newsInput, description: data });
    }

    const newsSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append('image', picture.image);

        formData.append('name', newsInput.name);
        formData.append('description', newsInput.description);
        formData.append('status', allCheckbox.status ? "1" : "0");

        formData.append('meta_title', newsInput.meta_title);
        formData.append('meta_keyword', newsInput.meta_keyword);
        formData.append('meta_descrip', newsInput.meta_descrip);

        axios.post(`/api/add-news`, formData).then(res => {
            if (res.data.status === 200) {
                swal('Tạo tin tức thành công', res.data.message, 'success');
                setError([]);
            } else if (res.data.status === 422) {
                swal('Vui lòng điền đầy đủ thông tin', '', 'error');
                setError(res.data.errors);
            }
        })

    }

    return (
        <div className='container-fluid px-4'>
            <h2 className='mt-4'>Tạo tin tức</h2>
            <form encType='multipart/form-data' onSubmit={newsSubmit}>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Thông tin tin tức</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                    </li>
                </ul>
                <div className="box pb-2">
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane card-body fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                            <div className='form-group mb-3'>
                                <label>Tên tin tức</label>
                                <input type='text' name='name' className='form-control'
                                    placeholder="Nhập tên tin tức..." onChange={handleInput} value={newsInput.name} />
                            </div>
                            <div className='text-danger'>{errorlist.name}</div>
                            <div className='form-group mb-3'>
                                <label>Mô tả</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data=""
                                    name='description'
                                    value={newsInput.description}
                                    onChange={handleDescrip}
                                    placeholder="Nhập mô tả..."
                                />
                            </div>
                            <div className='text-danger'>{errorlist.description}</div>
                            <div className='form-group mb-3'>
                                <label>Hình ảnh</label>
                                <input type='file' name='image' className='form-control' onChange={handleImage} />
                            </div>
                            <div className='text-danger'>{errorlist.image}</div>
                            <div className='form-group mb-3'>
                                <label>Trạng thái:</label>
                                <input type='checkbox' name='status' className='form-check-input ms-5' id="flexCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true : false} />
                                <label className="form-check-label " htmlFor="flexCheckChecked">
                                    Hiện
                                </label>
                            </div>
                        </div>
                        <div className="tab-pane card-body fade" id="seo-tags" role="tabpanel" aria-labelledby="profile-tab">
                            <div className='form-group mb-3'>
                                <label>Meta title</label>
                                <input type='text' name='meta_title' placeholder="Nhập meta title..." className='form-control' onChange={handleInput} value={newsInput.meta_title} />
                            </div>
                            <div className='text-danger'>{errorlist.meta_title}</div>
                            <div className='form-group mb-3'>
                                <label>Meta keywords</label>
                                <input type='text' name='meta_keyword' placeholder="Nhập meta keywords..." className='form-control' onChange={handleInput} value={newsInput.meta_keyword} />
                            </div>
                            <div className='text-danger'>{errorlist.meta_keyword}</div>
                            <div className='form-group mb-3'>
                                <label>Meta description</label>
                                <textarea type='text' name='meta_descrip' placeholder="Nhập meta description..." className='form-control' onChange={handleInput} value={newsInput.meta_descrip} />
                            </div>
                            <div className='text-danger'>{errorlist.meta_descrip}</div>
                        </div>
                    </div>
                    <Button type='submit' variant="outline-primary" className=' px-4 mx-3'>Thêm</Button>
                </div>
            </form>
        </div >
    )
}

export default AddNews;