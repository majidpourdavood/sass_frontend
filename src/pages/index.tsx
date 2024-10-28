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
import { toast} from 'react-toastify';
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
        }else{
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
                    <div className="col-md-8">
                        <div
                            className={"card " + styles.card}
                        >
                            <div
                                className={"card-body max-width-index" + styles.card_body}
                            >
                                <div className="row justify-content-center">
                                    <Link href="/">
                                       <h3 className="title-login">
                                           <span>Manage</span>
                                           <span>Petro</span>
                                       </h3>
                                    </Link>
                                </div>


                                <div className="row col-12">
                                    <div className="col justify-content-center d-flex">
                                        <Link className={"btn mt-4 btn-join-us btn-admin-dashboard"} href="/login">
                                           Login
                                        </Link>
                                    </div>

                                    <div className="col">
                                        <Link className={"btn mt-4 btn-join-us btn-admin-dashboard btn-admin-dashboard-three"}
                                              href="/register">
                                           Register
                                        </Link>
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
