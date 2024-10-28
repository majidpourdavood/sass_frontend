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

const Login = (props) => {
    const auth = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();


    useEffect(() => {
        if (auth && auth.user) {
            router.push('/panel/dashboard');
        } else {
            // toast.error('Invalid Username or Password', {
            //     position: 'top-right',
            //     autoClose: 3000,
            //     theme: 'colored',
            // });
        }
    }, [auth.user]);

    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required'),
    });
    const formOptions = {resolver: yupResolver(validationSchema)};

    // get functions to build form with useForm() hook
    const {register, handleSubmit, setError, formState} = useForm(formOptions);
    const {errors} = formState;
    const res = useSelector((state) => state);


    function onSubmit({username, password}) {
        const data = {
            username,
            password,
        };
        dispatch(loginUser(data));
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (


        <div
            className={styles.content_login_register}
        >
            <Head>
                <title>ManagePetro | Login</title>
                <meta name="description" content="ManagePetro | Login"/>

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
                                >login</h3>

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className={" " + styles.form_login_register}

                                >
                                    <div className={"form-group row " + styles.form_group}>
                                        <div className="col-12">
                                            <input
                                                type="text"
                                                name="username"
                                                {...register('username')}
                                                className={`form-control ${
                                                    errors.username ? 'is-invalid ' : ''
                                                }` + styles.form_control}

                                                autoComplete="identity"
                                                placeholder=" username"
                                                autoFocus
                                            />
                                            <FontAwesomeIcon
                                                className={" " + styles.font_login}
                                                icon={faUser}
                                            />
                                        </div>
                                    </div>

                                    <div className={"form-group row " + styles.form_group}>
                                        <div className=" col-12">
                                            <input
                                                type="password"
                                                name="password"
                                                {...register('password')}
                                                className={`form-control ${
                                                    errors.password ? 'is-invalid ' : ''
                                                }` + styles.form_control}
                                                autoComplete="current-password"
                                                placeholder="password"
                                            />
                                            <FontAwesomeIcon
                                                className={" " + styles.font_login}
                                                icon={faKey}
                                            />
                                        </div>
                                    </div>


                                    <div className="form-group row mb-0">
                                        <div className=" col-12">
                                            <button
                                                disabled={formState.isSubmitting}
                                                className={"btn " + styles.btn_login_register}
                                            >
                                                {formState.isSubmitting}
                                                Login
                                            </button>
                                        </div>
                                    </div>


                                    <hr/>
                                    <div className="form-group col-12 pr-2 pl-2">
                                        <Link className={"btn mt-4 btn-join-us width-100 d-block"} href="/register">
                                            Register
                                        </Link>
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

export default Login;
