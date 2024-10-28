import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/slices/authSlice';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faKey} from '@fortawesome/free-solid-svg-icons';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import {useRouter} from 'next/navigation';
import {toast} from 'react-toastify';
import {useAppSelector, useAppDispatch} from '../redux/slices/hooks';
import styles from '../css/login.module.css'
import Head from "next/head";
import {json} from "express";
import {constants} from "../utils/constants";
import axios from "axios";

const Register = (props) => {

    const auth = useAppSelector((state) => state.auth);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('username is required')
            .min(3, "username must be at least 3 characters")
            .max(1000, "username must be at least 1000 characters")
        ,

        password: Yup.string().required('password is required')
            .min(3, "password must be at least 3 characters")
            .max(1000, "password must be at least 1000 characters")
    });

    useEffect(() => {
        if (auth && auth.user) {
            router.push('/panel/dashboard');
        }else{
            // toast.error('Invalid Username or Password', {
            //     position: 'top-right',
            //     autoClose: 3000,
            //     theme: 'colored',
            // });
        }
    }, [auth.user]);

    const [initialValues, setInitialValues] = useState({
        username: "",
        roles: [],
        password: ""
    });

    const [checkedIds, setChekedIds] = useState([]);

    const handlechange = (e) => {
        const clickedId = e.target.value;
        if (checkedIds.includes(clickedId)) {
            setChekedIds(checkedIds.filter((id) => id !== clickedId));
        } else {
            setChekedIds([...checkedIds, clickedId]);
        }
    };

    const router = useRouter();
    const [errors, setErrors] = useState({
        roles: "",
        username: "",
        password: ""
    });


    const model = {
        username: initialValues.username,
        password: initialValues.password.toString(),
        roles: checkedIds,
    }

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
console.log(model)
        let isValid = await validationSchema.isValid(model);
        if (!isValid) {
            toast.error("Error In Validation", {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
            return false;
        }
        let message = "";
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_USER_REGISTER
        axios.post(url, model,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
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
                    router.push('/login');
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
    let roles = [
        {
            "id": 1,
            "name": "ROLE_MANAGER"
        },
        {
            "id": 2,
            "name": "ROLE_CLIENT"
        }, {
            "id": 3,
            "name": "ROLE_USER"
        }
    ];
    return (


        <div
            className={styles.content_login_register}
        >
            <Head>
                <title>ManagePetro | Register</title>
                <meta name="description" content="ManagePetro | Register"/>

            </Head>

            <div className="container h-100">
                <div
                    className={"row justify-content-center h-100 align-items-center " + styles.login_register_page}
                >
                    <div className="col-md-6">
                        <div
                            className={"card " + styles.card}
                        >
                            <div
                                className={"card-body " + styles.card_body}
                            >
                                <div className="row justify-content-center">
                                    <Link href="/">
                                        <h3 className="title-login">
                                            <span>Manage</span>
                                            <span>Petro</span>
                                        </h3>
                                    </Link>
                                </div>

                                <h3
                                    className={" " + styles.title_login_register_page}
                                >Register</h3>

                                <form
                                    onSubmit={submitForm}
                                    className={" " + styles.form_login_register}

                                >

                                    <div className={"form-group row " + styles.form_group}>
                                        <div className="col-12">
                                            <label className="title-register-input"  htmlFor="username">username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                className={`form-control ${
                                                    errors.username ? 'is-invalid ' : ''
                                                }` + styles.form_control}
                                                autoComplete="username"
                                                placeholder="username"
                                                id="username"
                                                value={initialValues.username}
                                                onChange={(e) =>
                                                    setInitialValues({...initialValues, username: e.target.value})
                                                }
                                                autoFocus
                                            />
                                            <div className="invalid-feedback">{errors.username}</div>

                                        </div>
                                    </div>


                                    <div className={"form-group row " + styles.form_group}>
                                        <div className=" col-12">
                                            <label className="title-register-input" htmlFor="password">password</label>
                                            <input
                                                type="text"
                                                name="password"
                                                className={`form-control ${
                                                    errors.password ? 'is-invalid ' : ''
                                                }` + styles.form_control}
                                                id="password"
                                                value={initialValues.password}
                                                onChange={(e) =>
                                                    setInitialValues({...initialValues, password: e.target.value})
                                                }

                                            />
                                            <div className="invalid-feedback">{errors.password}</div>

                                        </div>
                                    </div>

                                    <div className={"form-group row " + styles.form_group}>
                                        <div className=" col-12 text-left">

                                            {roles.map((role, key) => {
                                                return (
                                                    <>
                                                        <div className="custom-control custom-checkbox">
                                                            <input
                                                                onChange={handlechange}
                                                                className="custom-control-input"
                                                                name="roles" type="checkbox"
                                                                id={"customCheck-" + key}
                                                                value={role.name}
                                                            />

                                                            <label className="custom-control-label"
                                                                   htmlFor={"customCheck-" + key}>
                                                                {role.name}
                                                            </label>
                                                        </div>
                                                    </>
                                                );
                                            })}

                                        </div>
                                    </div>

                                    <div className="form-group row mb-0">
                                        <div className=" col-12">
                                            <button
                                                className={"btn " + styles.btn_login_register}
                                            >
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
