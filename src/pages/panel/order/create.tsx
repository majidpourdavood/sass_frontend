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


function CreateOrder(props) {

    const auth = useAppSelector((state) => state.auth);

    const validationSchema = Yup.object().shape({
        client: Yup.string().required('client is required'),
        delivery: Yup.string().required('delivery is required'),
        origin: Yup.string().required('origin is required'),
        destination: Yup.string().required('destination is required'),
        amount_fuel: Yup.string().required('amount_fuel is required'),
    });

    const [initialValues, setInitialValues] = useState({
        client: "",
        delivery: "",
        origin: "",
        destination: "",
        amount_fuel: ""
    });

    const router = useRouter();
    const [errors, setErrors] = useState({
        client: "",
        delivery: "",
        origin: "",
        destination: "",
        amount_fuel: ""
    });


    const model = {
        client: initialValues.client,
        delivery: initialValues.delivery,
        origin: initialValues.origin,
        destination: initialValues.destination,
        amount_fuel: initialValues.amount_fuel,
    }


    let userToken = auth.user ? auth.user.token : "";
    useEffect(() => {
        validateForm();
        console.log(props)
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
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_STORE_Order
        axios.post(url, model,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": bearer
                },
            })
            .then(res => {

                if (res.data.status && res.data.status == "success") {
                    message = res.data.message;
                    toast.success(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                    router.push('/panel/order/all');
                } else {
                    message = res.toString();
                    toast.warning(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                }

            }).catch(error => {
console.log(error.toString())
console.log(model)
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
                <title>ManagePetro | Create Order</title>
                <meta name="description" content="ManagePetro | Create Order"/>
            </Head>
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header d-flex align-items-center py-3">
                        <h6 className="m-0 font-weight-bold text-primary col-6">Create Order</h6>
                        <div className="text-right col-6">
                            <Link href="/panel/order/all" className="btn btn-primary">
                                all
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <form
                            onSubmit={submitForm}
                            className=""
                        >

                            <div className=" form-group row ">
                                <div className=" col-12 mb-2">
                                    <label className=" font-weight-bold" htmlFor="delivery">delivery</label>

                                    <select    className={`form-control ${
                                        errors.delivery ? 'is-invalid' : ''
                                    }`}
                                               onChange={(e) =>
                                                   setInitialValues({...initialValues, delivery: e.target.value})
                                               }

                                    >
                                        <option value="">select</option>
                                        {props.deliveries.data.map((delivery, key) => {
                                        return (
                                            <>
                                                    <option value={delivery.id}>{delivery.name}</option>

                                            </>
                                        );
                                    })}
                                    </select>
                                    <div className="invalid-feedback">{errors.delivery}</div>

                                </div>
                            </div>


                            <div className=" form-group row">
                                <div className=" col-12 mb-2">
                                    <label className=" font-weight-bold" htmlFor="origin">origin</label>

                                    <select
                                        className={`form-control ${
                                            errors.origin ? 'is-invalid' : ''
                                        }`}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues,
                                                origin: e.target.value,
                                            })
                                        }
                                    >
                                        <option value="">select</option>
                                        {props.places.data.map((place, key) => {
                                            return (
                                                <>
                                                    <option value={place.id}>{place.name}</option>

                                                </>
                                            );
                                        })}
                                    </select>
                                    <div className="invalid-feedback">{errors.origin}</div>

                                </div>
                            </div>

                            <div className=" form-group row">
                                <div className=" col-12 mb-2">
                                    <label className=" font-weight-bold" htmlFor="destination">destination</label>

                                    <select
                                        className={`form-control ${
                                            errors.destination ? 'is-invalid' : ''
                                        }`}
                                            onChange={(e) =>
                                                setInitialValues({...initialValues,
                                                    destination: e.target.value,
                                                })
                                            }
                                           >
                                        <option value="">select</option>
                                        {props.places.data.map((place, key) => {
                                            return (
                                                <>
                                                    <option value={place.id}>{place.name}</option>

                                                </>
                                            );
                                        })}
                                    </select>
                                    <div className="invalid-feedback">{errors.destination}</div>

                                </div>
                            </div>

                            <div className=" form-group row">
                                <div className=" col-12 mb-2">
                                    <label className=" font-weight-bold" htmlFor="clients">clients</label>

                                    <select
                                        className={`form-control ${
                                            errors.client ? 'is-invalid' : ''
                                        }`}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues, client: e.target.value})
                                        }
                                    >
                                        <option value="">select</option>
                                        {props.clients.data.map((client, key) => {
                                            return (
                                                <>
                                                    <option value={client.id}>{client.username}</option>

                                                </>
                                            );
                                        })}
                                    </select>
                                    <div className="invalid-feedback">{errors.client}</div>

                                </div>
                            </div>

                            <div className="form-group row">
                                <div className=" col-12 mb-2">
                                    <label className=" font-weight-bold" htmlFor="amount_fuel">amount_fuel</label>
                                    <input
                                        type="number"
                                        name="amount_fuel"
                                        className={`form-control ${
                                            errors.amount_fuel ? 'is-invalid' : ''
                                        }`}
                                        autoComplete="amount_fuel"
                                        placeholder="345"
                                        id="amount_fuel"
                                        value={initialValues.amount_fuel}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues, amount_fuel: e.target.value})
                                        }
                                        autoFocus
                                    />
                                    <div className="invalid-feedback">{errors.amount_fuel}</div>

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

export async function getServerSideProps({req, res, params}) {
    let clients;
    let deliveries;
    let places;
    try {
        const cookies = qs.decode(req.headers.cookie, "; ")
        let user = JSON.parse(cookies.user as string);
        if (!user) {
            return {
                props: {
                    clients: null,
                    deliveries: null,
                    places: null,
                }
            }
        }

        let bearer = 'Bearer ' + user.token;

        const urlDelivery = process.env.URL_WEBSITE_SERVER + constants.URL_ALL_Delivery
        deliveries = await axios(urlDelivery, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": bearer
            },
        })
            .then((response) => {
                console.log(response.data)
                return response.data;
            })
            .catch((error) => {
                return error.toString();
            });

        const urlUSER = process.env.URL_WEBSITE_SERVER + constants.URL_ALL_USER
        clients = await axios(urlUSER, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": bearer
            },
        })
            .then((response) => {
                console.log(response.data)
                return response.data;
            })
            .catch((error) => {
                return error.toString();
            });

        const urlPlace = process.env.URL_WEBSITE_SERVER + constants.URL_ALL_Place
        places = await axios(urlPlace, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization": bearer
            },
        })
            .then((response) => {
                console.log(response.data)
                return response.data;
            })
            .catch((error) => {
                return error.toString();
            });

    } catch (error) {
        deliveries = error.toString();
    }

    return {
        props: {
            clients: clients,
            deliveries: deliveries,
            places: places,
        }
    }
}


export default CreateOrder;
