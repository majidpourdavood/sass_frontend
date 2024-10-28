import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import qs from 'querystring';
import axios from 'axios';
import {constants} from '../../../utils/constants';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from "../../../redux/slices/hooks";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Head from "next/head";


function CreateDelivery(props) {

    const auth = useAppSelector((state) => state.auth);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required')
            .min(3, "name must be at least 3 characters")
            .max(1000, "name must be at least 1000 characters")
        ,
        capacity: Yup.string().required('capacity is required')
        ,
    });

    const [initialValues, setInitialValues] = useState({
        name: "delivery number",
        capacity: 212
    });

    const router = useRouter();
    const [errors, setErrors] = useState({
        name: "",
        capacity: ""
    });


    const model = {
        name: initialValues.name,
        capacity: initialValues.capacity,
    }


    let userToken  = auth.user ? auth.user.token : "";
    useEffect(() => {
        validateForm();
    }, [initialValues]);




    async function validateForm() {

        await validationSchema.validate(model, {abortEarly: false}).catch(function (err) {
            for (var key in model) {
                if (model.hasOwnProperty(key)) {
                    let keyFilter = err.inner.filter((e) => e.path == key + "");
                    if (keyFilter[0] && keyFilter[0].path) {
                        errors[key] = keyFilter[0].message;
                    } else {
                        errors[key] = '';
                    }
                    setErrors({...errors})

                }
            }

        }).then((result) => {
            if (result) {
                for (var key in result) {
                    errors[key] = '';
                }
                setErrors({...errors})
            }
        });

    }

    const submitForm = async (e) => {
        e.preventDefault();

        let isValid = await validationSchema.isValid(model);
        if (!isValid) {
            toast.error("Error In Validation", {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
            return false;
        }
        let bearer = 'Bearer ' + userToken;
        let message = "";
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_STORE_Delivery
        axios.post(url, model,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": bearer
                },
            })
            .then(res => {

                if (res.data.status && res.data.status == "success" ) {
                    message = res.data.message;
                    toast.success(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                    router.push('/panel/delivery/all');
                } else {
                    message = res.toString();
                    toast.warning(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                }

            }).catch(error => {

            if (error.response.data.message) {
                message = error.response.data.message;
            } else {
                message = error.toString();
            }
            toast.error(" " + message, {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
        });

    };

    return (
        <>

            <Head>
                <title>ManagePetro | Create Delivery</title>
                <meta name="description" content="ManagePetro | Create Delivery"/>
            </Head>
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header d-flex align-items-center py-3">
                        <h6 className="m-0 font-weight-bold text-primary col-6">Create deliveries</h6>
                        <div className="text-right col-6">
                            <Link href="/panel/delivery/all" className="btn btn-primary">
                                all
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <form
                            onSubmit={submitForm}
                            className=""
                        >

                            <div className="form-group row">
                                <div className="col-12">
                                    <label htmlFor="name">name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${
                                            errors.name ? 'is-invalid' : ''
                                        }`}
                                        autoComplete="name"
                                        placeholder="name"
                                        id="name"
                                        value={initialValues.name}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues, name: e.target.value})
                                        }
                                        autoFocus
                                    />
                                    <div className="invalid-feedback">{errors.name}</div>

                                </div>
                            </div>


                            <div className="form-group row">
                                <div className="col-12">
                                    <label htmlFor="capacity">capacity</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        className={`form-control ${
                                            errors.capacity ? 'is-invalid' : ''
                                        }`}
                                        autoComplete="capacity"
                                        placeholder="capacity"
                                        id="capacity"
                                        value={initialValues.capacity}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues, capacity: parseInt(e.target.value)})
                                        }
                                        autoFocus
                                    />
                                    <div className="invalid-feedback">{errors.capacity}</div>

                                </div>
                            </div>


                            <div className="form-group row mb-0">
                                <div className=" col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

            </div>

        </>
    );

}



export default CreateDelivery;
