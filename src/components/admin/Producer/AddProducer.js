import axios from 'axios';
import React, { useState } from 'react';
import swal from 'sweetalert';
import { Button } from 'react-bootstrap';

function AddProrucer() {
    document.title = 'Create Producer';

    const [producerInput, setProducer] = useState({
        slug: '',
        name: '',
        description: '',
        meta_title: '',
        meta_descrip: '',
        meta_keyword: '',
    })
    const [errorlist, setError] = useState([]);
    const [allCheckbox, setCheckbox] = useState([]);


    const handleInput = (e) => {
        e.persist();
        setProducer({ ...producerInput, [e.target.name]: e.target.value })
    }

    const handleCheckbox = (e) => {
        e.persist();
        setCheckbox({ ...allCheckbox, [e.target.name]: e.target.checked });
    }

    const submitProducer = (e) => {
        e.preventDefault();

        
        const formData = new FormData();


        formData.append('name', producerInput.name);
        formData.append('slug', producerInput.slug);
        formData.append('description', producerInput.description);

        formData.append('meta_title', producerInput.meta_title);
        formData.append('meta_keyword', producerInput.meta_keyword);
        formData.append('meta_descrip', producerInput.meta_descrip);

        formData.append('status', allCheckbox.status ? "1":"0");


        axios.post(`/api/store-producer`, formData).then(res => {
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
            <h2 className='mt-4'>Create Producer</h2>
            <form onSubmit={submitProducer} id="PRODUCER_FORM">
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
                            <input type='text' name='slug' onChange={handleInput} value={producerInput.slug} className='form-control' />
                        </div>
                        <div className='notifyText'>{errorlist.slug}</div>
                        <div className='form-group mb-3'>
                            <label>Name</label>
                            <input type='text' name='name' onChange={handleInput} value={producerInput.name} className='form-control' />
                        </div>
                        <div className='notifyText'>{errorlist.name}</div>
                        <div className='form-group mb-3'>
                            <label>Description</label>
                            <input type='text' name='description' onChange={handleInput} value={producerInput.description} className='form-control' />
                        </div>
                        <div className='notifyText'>{errorlist.description}</div>
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
                            <input type='text' name='meta_title' onChange={handleInput} value={producerInput.meta_title} className='form-control' />
                        </div>
                        <div className='notifyText'>{errorlist.meta_title}</div>
                        <div className='form-group mb-3'>
                            <label>Meta keywords</label>
                            <input type='text' name='meta_keyword' onChange={handleInput} value={producerInput.meta_keyword} className='form-control' />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Meta description</label>
                            <textarea type='text' name='meta_descrip' onChange={handleInput} value={producerInput.meta_descrip} className='form-control' />
                        </div>
                    </div>
                </div>
                <Button type='submit' variant="outline-primary" className=' px-4 float-end'>Create</Button>
            </form>
        </div >
    )
}
export default AddProrucer;