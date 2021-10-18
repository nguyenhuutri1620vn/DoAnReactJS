import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import swal from "sweetalert";
import { Button } from 'react-bootstrap';

function EditCategory(props) {

    document.title = 'Edit Category';

    const [picture, setPicture] = useState([]);
    const history = useHistory();
    const [loading, setloading] = useState(true);
    const [categoryInput, setCategory] = useState({
        slug: '',
        name: '',
        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',
        description: '',
    });
    const [error, setError] = useState([]);
    const [allCheckbox, setCheckbox] = useState([]);

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    const handleInput = (e) => {
        e.persist();
        setCategory({ ...categoryInput, [e.target.name]: e.target.value })
    }

    const handleImage = (e) => {
        e.persist();
        setPicture({ image: e.target.files[0] });
    }

    useEffect(() => {

        const category_id = props.match.params.id;
        axios.get(`/api/edit-category/${category_id}`).then(res => {
            if (res.data.status === 200) {
                setCategory(res.data.category);
                setCheckbox(res.data.category);
            } else if (res.data.status === 404) {
                swal('Error', res.data.message, 'error')
                history.push('/admin/view-category')
            }
            setloading(false);
        });
    }, [props.match.params.id, history]);
    const updateCategory = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('image', picture.image);

        formData.append('name', categoryInput.name);
        formData.append('slug', categoryInput.slug);
        formData.append('description', categoryInput.description);

        formData.append('meta_title', categoryInput.meta_title);
        formData.append('meta_keyword', categoryInput.meta_keyword);
        formData.append('meta_descrip', categoryInput.meta_descrip);

        formData.append('status', allCheckbox.status ===true ? "1" : "0");

        const category_id = props.match.params.id;
        axios.post(`/api/update-category/${category_id}`, formData).then(res => {
            if (res.data.status === 200) {
                swal('Success', res.data.message, 'success')
                setError([]);
                history.push('/admin/view-category')
            } else if (res.data.status === 400) {
                swal('All fields are mandatory', '', 'error');
                setError(res.data.errors);
            }
        })
    }

    console.log(allCheckbox.status);

    if (loading) {
        <h3>Loading catogory data loading...</h3>
    }

    return (
        <div className='container px-4'>
            <h2 className='mt-4'>Edit Category
                <Link to='/admin/view-category' className='btn btn-danger float-end btn-sm'>Back</Link></h2>
            <form onSubmit={updateCategory}>
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
                        <small className='text-danger'>{error.slug}</small>
                        <div className='form-group mb-3'>
                            <label>Name</label>
                            <input type='text' name='name' onChange={handleInput} value={categoryInput.name} className='form-control' />
                        </div>
                        <small className='text-danger'>{error.name}</small>
                        <div className='form-group mb-3'>
                            <label>Description</label>
                            <textarea name='description' onChange={handleInput} value={categoryInput.description} className='form-control' />
                        </div>
                        <div className='col-md-6 form-group mb-3'>
                            <label>Image</label>
                            <input type='file' name='image' onChange={handleImage} className='form-control' />
                            <img src={`http://localhost:8000/${[categoryInput.image]}`} width='300px' className='mt-4' alt={categoryInput.name} />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Status</label>
                            <input type='checkbox' name='status' className='form-check-input ms-5' id='status' onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true : false} />
                            <label className="form-check-label " htmlFor='status'>
                                Shown
                            </label>
                        </div>
                    </div>
                    <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="profile-tab">
                        <div className='form-group mb-3'>
                            <label>Meta title</label>
                            <input type='text' name='meta_title' onChange={handleInput} value={categoryInput.meta_title} className='form-control' />
                        </div>
                        <small className='text-danger'>{error.meta_title}</small>
                        <div className='form-group mb-3'>
                            <label>Meta keywords</label>
                            <input type='text' name='meta_keyword' onChange={handleInput} value={categoryInput.meta_keyword} className='form-control' />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Meta description</label>
                            <textarea name='meta_descrip' onChange={handleInput} value={categoryInput.meta_descrip} className='form-control' />
                        </div>
                    </div>
                </div>
                <Button type='submit' variant="outline-primary" className=' px-4 float-end'>Update</Button>
            </form>
        </div >
    )
}
export default EditCategory