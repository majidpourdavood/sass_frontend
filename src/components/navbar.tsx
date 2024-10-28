import React from 'react';
import Link from 'next/link';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import Router from 'next/router';
import {toast} from 'react-toastify';
import {logoutUser} from '../redux/slices/authSlice';
import {useAppDispatch, useAppSelector} from '../redux/slices/hooks';
import {useEffect, useState} from 'react';
import Image from "next/image";

function Navbar(props) {
    const dispatch = useAppDispatch();
    let user;
    let routeProfile;
    if (props.props && props.props.user) {
        user = JSON.parse(props.props.user);
        routeProfile = '/panel/dashboard';
    }

    function logout() {
        dispatch(logoutUser(null));
        toast.success('You have successfully logged out', {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
        });
        Router.push('/login');
    }

    const [navbarToggleTop, setNavbarToggleTop] = useState(false);


    return (
        <>
            <div className=" bg-gradiant header">
                <div className="container">
                </div>
            </div>

        </>
    );
}


export default Navbar;

