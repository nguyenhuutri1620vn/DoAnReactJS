import React, { useEffect, useState } from 'react'
import axios from 'axios';


const Footer = () => {

    const [config, setConfig] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get(`/api/footer`).then(res => {
            if (res.data.status === 200) {
                setConfig(res.data.config);
            }
            setLoading(false);
        })
    }, [])

    if (loading) {
        return <div className='loading'></div>
    } else {
        var footer_HTML = '';
        footer_HTML = config.map((item) => {
            return (
                <div className="row mt-3" key={item.id}>
                    <div className="col-md-3 col-lg-4 col-xl-3">
                        <h6 className="text-uppercase fw-bold">
                            <i className="fas fa-guitar"></i>{item.name}
                        </h6>
                        <p>
                            {item.slogan}
                        </p>
                    </div>
                    <div className='navbar__spacer'></div>
                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0">
                        <h6 className="text-uppercase fw-bold ">
                            Liên hệ
                        </h6>
                        <p><i className="fas fa-home me-3"></i>Địa chỉ: {item.address}</p>
                        <p>
                            <i className="fas fa-envelope me-3"></i>
                            {item.email}
                        </p>
                        <p><i className="fas fa-phone me-3"></i>{item.phone}</p>
                    </div>
                </div>
            )
        });
    }

    return (
        <div className='footer text-center text-lg-start bg-light text-muted'>
            <div className="container text-md-start mt-2">
                {footer_HTML}
            </div>
        </div>

    )
}
export default Footer;