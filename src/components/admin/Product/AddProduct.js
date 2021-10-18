import axios from "axios";
import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InputGroup} from 'react-bootstrap';
import { Button } from 'react-bootstrap';

function AddProduct() {
    document.title = 'Create Product';

    const [categorylist, setCategorylist] = useState([]);
    const [producerlist, setProducerlist] = useState([]);
    const [errorlist, setError] = useState([]);
    const [picture, setPicture] = useState([]);
    const [productInput, setProduct] = useState({
        cateID: '',
        producerID: '',
        name: '',
        description: '',

        meta_title: '',
        meta_keyword: '',
        meta_descrip: '',

        original_price: '',
        selling_price: '',
        number: '',
    });
    const [allCheckbox, setCheckbox] = useState([]);


    const handleInput = (e) => {
        e.persist();
        setProduct({ ...productInput, [e.target.name]: e.target.value });
    }

    const handleImage = (e) => {
        e.persist();
        setPicture({ image: e.target.files[0] });
    }

    const handleDescrip = (e, editor) => {
        const data = editor.getData();
        setProduct({ ...productInput, description: data });
    }

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    useEffect(() => {
        axios.get(`api/all-category`).then(res => {
            if (res.data.status === 200) {
                setCategorylist(res.data.category);
                console.log(res.data.category);
            }
        })
        axios.get(`api/all-producer`).then(res => {
            if (res.data.status === 200) {
                setProducerlist(res.data.producer);
            }
        })
    }, [])

    const submitProduct = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('image', picture.image);

        formData.append('cateID', productInput.cateID);
        formData.append('producerID', productInput.producerID);
        formData.append('name', productInput.name);
        formData.append('description', productInput.description);

        formData.append('meta_title', productInput.meta_title);
        formData.append('meta_keyword', productInput.meta_keyword);
        formData.append('meta_descrip', productInput.meta_descrip);

        formData.append('original_price', productInput.original_price);
        formData.append('selling_price', productInput.selling_price);
        formData.append('number', productInput.number);
        formData.append('featured', allCheckbox.featured ? "1":"0");
        formData.append('popular', allCheckbox.popular ? "1":"0");
        formData.append('status', allCheckbox.status ? "1":"0");


        axios.post(`/api/store-product`, formData).then(res => {
            if (res.data.status === 200) {
                swal('Sucess', res.data.message, 'success');
                setError([]);

            } else if (res.data.status === 422) {
                swal('All fields are mandatory', '', 'error');
                setError(res.data.errors);
            }
        })
    }
   return (
        <div className='container-fluid px-4'>
            <h2 className='mt-4'>Create Product</h2>
            <form onSubmit={submitProduct} encType='multipart/form-data'>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Home</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="other-tab" data-bs-toggle="tab" data-bs-target="#other-tags" type="button" role="tab" aria-controls="other-tags" aria-selected="false">Other Details</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane card-body border fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div className='row'>
                            <div className='col-md-6 form-group mb-3'>
                                <label>Category</label>
                                <select name='cateID' className='form-select' aria-label="Default select example" onChange={handleInput} value={productInput.cateID}>
                                    <option>Select category</option>
                                    {
                                        categorylist.map((item) => {
                                            return (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <small className='text-danger'>{errorlist.cateID}</small>
                            </div>
                            <div className='col-md-6 form-group mb-3' >
                                <label>Brand</label>
                                <select name='producerID' className='form-select' aria-label="Default select example" onChange={handleInput} value={productInput.producerID}>
                                    <option>Select brand</option>
                                    {
                                        producerlist.map((item) => {
                                            return (
                                                <option value={item.id} key={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <small className='text-danger'>{errorlist.producerID}</small>

                            </div>
                        </div>
                        <div className='form-group mb-3'>
                            <label>Name</label>
                            <input type='text' name='name' onChange={handleInput} value={productInput.name} className='form-control' />
                        </div>
                        <small className='text-danger'>{errorlist.name}</small>

                        <div className='form-group mb-3'>
                            <label>Description</label>
                            {/* <textarea type='text' name='description' id='description' onChange={handleInput} value={productInput.description} className='form-control' /> */}
                            <CKEditor
                                editor={ClassicEditor}
                                data=''
                                name='description'
                                onChange={handleDescrip}
                                value={productInput.description}
                            />
                        </div>
                    </div>
                    <div className="tab-pane card-body border fade" id="seo-tags" role="tabpanel" aria-labelledby="profile-tab">
                        <div className='form-group mb-3'>
                            <label>Meta title</label>
                            <input type='text' name='meta_title' onChange={handleInput} value={productInput.meta_title} className='form-control' />
                        </div>
                        <small className='text-danger'>{errorlist.meta_title}</small>

                        <div className='form-group mb-3'>
                            <label>Meta keywords</label>
                            <input type='text' name='meta_keyword' onChange={handleInput} value={productInput.meta_keyword} className='form-control' />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Meta description</label>
                            <textarea type='text' name='meta_descrip' onChange={handleInput} value={productInput.meta_descrip} className='form-control h-50' /> 
                        </div>
                    </div>
                    <div className="tab-pane card-body border fade" id="other-tags" role="tabpanel" aria-labelledby="other-tab">
                        <div className='row'>
                            <div className='col-md-4 form-group mb-3'>
                                <label>Original price</label>
                                <InputGroup >
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <input type='text' name='original_price' onChange={handleInput} value={productInput.original_price} className='form-control' />
                                    <InputGroup.Text>.00</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <small className='text-danger'>{errorlist.original_price}</small>
                            <div className='col-md-4 form-group mb-3'>
                                <label>Selling price</label>
                                <InputGroup >
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <input type='text' name='selling_price' onChange={handleInput} value={productInput.selling_price} className='form-control' />
                                    <InputGroup.Text>.00</InputGroup.Text>
                                </InputGroup>
                            </div>
                            <small className='text-danger'>{errorlist.selling_price}</small>

                            <div className='col-md-4 form-group mb-3'>
                                <label>Quantity</label>
                                <input type='text' name='number' onChange={handleInput} value={productInput.number} className='form-control' />
                            </div>
                            <small className='text-danger'>{errorlist.number}</small>

                            <div className='col-md-6 form-group mb-3'>
                                <label>Image</label>
                                <input type='file' name='image' onChange={handleImage} className='form-control' />
                            </div>
                            <small className='text-danger'>{errorlist.image}</small>
                            <div className='col-md-4 form-group mb-3'>
                                <label>Featured</label>
                                <input type='checkbox' name='featured' className='form-check-input ms-5' id="featuredCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.featured === 1 ? true:false} />
                                <label className="form-check-label " htmlFor="featuredCheckChecked">
                                    Check
                                </label>
                            </div>
                            <div className='col-md-4 form-group mb-3'>
                                <label>Popular</label>
                                <input type='checkbox' name='popular' className='form-check-input ms-5' id="popularCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.popular === 1 ? true:false} />
                                <label className="form-check-label " htmlFor="popularCheckChecked">
                                    Check
                                </label>
                            </div>
                            <div className='col-md-4 form-group mb-3'>
                                <label>Status</label>
                                <input type='checkbox' name='status' className='form-check-input ms-5' id="statusCheckChecked" onChange={handleCheckbox} defaultChecked={allCheckbox.status === 1 ? true:false} />
                                <label className="form-check-label " htmlFor="statusCheckChecked">
                                    Shown
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <Button type='submit' variant="outline-primary" className=' px-4 float-end'>Create</Button>
            </form>
        </div >
    )
}

export default AddProduct