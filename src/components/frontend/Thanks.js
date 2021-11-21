import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import thanks from '../../assets/frontend/image/thanks.jpg';

function Thanks() {
    return (
        <div className='container thanks-you text-center'>
            <Card body className='my-5'>
                <h1 className='mt-2'>Cảm ơn quý khách</h1>
                <h1 className='mt-1'>Đã ủng hộ và tin tưởng chúng tôi</h1>
                <img alt='thanks' src={thanks} className='image-thanks'/>
                <h5 className='mt-3'>Nhấn vào <Link to='/'>đây</Link> để quay lại trang chủ</h5>
            </Card>
        </div>
    )
}
export default Thanks