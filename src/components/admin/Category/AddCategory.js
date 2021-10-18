import axios from 'axios';
import React, { useState } from 'react';
import swal from 'sweetalert';
import { Button , Badge } from 'react-bootstrap';


function AddCategory() {

    document.title = 'Create Category';

    const [picture, setPicture] = useState([]);
    const [errorlist, setError] = useState([]);
    const [categoryInput, setCategory] = useState({
        slug: '',
        name: '',
        description: '',
        meta_title: '',
        meta_descrip: '',
        meta_keyword: '',
    })
    const [allCheckbox, setCheckbox] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setCategory({ ...categoryInput, [e.target.name]: e.target.value })
    }

    const handleImage = (e) => {
        e.persist();
        setPicture({ image: e.target.files[0] });
    }

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    const submitCategory = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('image', picture.image);

        formData.append('name', categoryInput.name);
        formData.append('slug', categoryInput.slug);
        formData.append('description', categoryInput.description);

        formData.append('meta_title', categoryInput.meta_title);
        formData.append('meta_keyword', categoryInput.meta_keyword);
        formData.append('meta_descrip', categoryInput.meta_descrip);

        formData.append('status', allCheckbox.status ? "1":"0");


        axios.post(`/api/store-category`, formData).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success')
                setError([]);
            } else if (res.data.status === 400) {
                swal('All fields are mandatory', '', 'error');
                setError(res.data.errors);
            }
        })
    }

    return (
        <div className='container-fluid px-4'>
            <h2 className='mt-4'>Create <Badge bg="primary" text="dark">Category</Badge></h2>
            <form onSubmit={submitCategory} id="CATEGORY_FORM">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div className='form-group mb-3'>
                            <label>Slug</label>
                            <input type='text' name='slug' onChange={handleInput} value={categoryInput.slug} className='form-control' />
                        </div>
                        <div className='notifyText'>{errorlist.slug}</div>
                        <div className='form-group mb-3'>
                            <label>Name</label>
                            <input type='text' name='name' onChange={handleInput} value={categoryInput.name} className='form-control' />
                        </div>
                        <div className='notifyText'>{errorlist.name}</div>
                        <div className='form-group mb-3'>
                            <label>Description</label>
                            <input type='text' name='description' onChange={handleInput} value={categoryInput.description} className='form-control' />
                        </div>
                        <div className='col-md-6 form-group mb-3'>
                            <label>Image</label>
                            <input type='file' name='image' onChange={handleImage} className='form-control' />
                        </div>
                       
                        <div className='notifyText'>{errorlist.image}</div>
                        <div className='form-group mb-3'>
                            <label>Status</label>
                            <input type='checkbox' name='status' className='form-check-input ms-5' id="flexCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true:false} />
                            <label className="form-check-label " htmlFor="flexCheckChecked">
                                Shown
                            </label>
                        </div>

                    </div>
                    <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="profile-tab">
                        <div className='form-group mb-3'>
                            <label>Meta title</label>
                            <input type='text' name='meta_title' onChange={handleInput} value={categoryInput.meta_title} className='form-control' />
                        </div>

                        <div className='notifyText'>{errorlist.meta_title}</div>
                        <div className='form-group mb-3'>
                            <label>Meta keywords</label>
                            <input type='text' name='meta_keyword' onChange={handleInput} value={categoryInput.meta_keyword} className='form-control' />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Meta description</label>
                            <textarea type='text' name='meta_descrip' onChange={handleInput} value={categoryInput.meta_descrip} className='form-control h-50' /> 
                        </div>
                    </div>
                    <Button type='submit' variant="outline-primary" className=' px-4 float-end'>Create</Button>
                </div>
            </form>
        </div >
    )
}
export default AddCategory;