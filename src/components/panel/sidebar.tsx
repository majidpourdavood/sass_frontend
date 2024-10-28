import React from 'react';
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState, useRef} from 'react';

import {
    faUser,
    faTachometerAlt,
    faLaughWink,
    faFolder,
    faNetworkWired,
    faBars,
    faSearch, faSignOutAlt, faTimes
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {logoutUser} from "../../redux/slices/authSlice";
import {toast} from "react-toastify";
import Router from "next/router";
import {useAppDispatch, useAppSelector} from "../../redux/slices/hooks";

function SidebarPanel({children, props}) {

    const [dropdown, setDropdown] = useState({
        class: "",
        status: false,
    });

    const [logoutModal, setLogoutModal] = useState({
        status: false,
    });
    const [open, setOpen] = useState(false);
    const [sidebarToggleTop, setSidebarToggleTop] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const ref = useRef(null);

    const toggleDropdown = (status) => {
        setDropdown({
            class: status == true ? "" : "show",
            status: !status
        });
    }

    let user;

    if (props) {
        user = JSON.parse(props.user);
    }


    const dispatch = useAppDispatch();

    function logout() {
        dispatch(logoutUser(null));
        toast.success('You have successfully logged out', {
            position: 'top-right',
            autoClose: 5000,
            theme: 'colored',
        });
        Router.push('/login');
    }


    return (
        <>
            <div id="wrapper">


                <ul

                    className={"navbar-nav bg-gradient-primary sidebar sidebar-dark accordion " + (sidebarToggleTop ? 'toggled' : '')}
                    id="accordionSidebar">

                    <Link className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                        <div className="sidebar-brand-icon rotate-n-15">
                            <FontAwesomeIcon
                                icon={faLaughWink}
                                style={{width: 20, color: '#e6e6e6'}}
                            />
                        </div>
                        <div className="sidebar-brand-text mx-3">Panel Admin <sup>2</sup></div>
                    </Link>

                    <hr className="sidebar-divider "/>
                    <div className="sidebar-heading">
                        Addons
                    </div>


                    <li className="nav-item ">
                        <Link className="nav-link" href="/panel/dashboard">
                            <FontAwesomeIcon
                                icon={faTachometerAlt}
                                style={{width: 16, color: '#e6e6e6', float: "right"}}
                            />
                            <span>Dashboard</span>
                        </Link>

                    </li>

                    <hr className="sidebar-divider"/>
                    <li className="nav-item">
                        <Link className="nav-link" href="/panel/user/all">
                            <FontAwesomeIcon
                                icon={faNetworkWired}
                                style={{width: 16, color: '#e6e6e6', float: "right"}}
                            />
                            <span>Users</span></Link>
                    </li>
                    <hr className="sidebar-divider"/>
                    <li className="nav-item">
                        <Link className="nav-link" href="/panel/delivery/all">
                            <FontAwesomeIcon
                                icon={faNetworkWired}
                                style={{width: 16, color: '#e6e6e6', float: "right"}}
                            />
                            <span>Delivery</span></Link>
                    </li>
                    <hr className="sidebar-divider"/>

                    <li className="nav-item">
                        <Link className="nav-link" href="/panel/place/all">
                            <FontAwesomeIcon
                                icon={faNetworkWired}
                                style={{width: 16, color: '#e6e6e6', float: "right"}}
                            />
                            <span>Places</span></Link>
                    </li>
                    <hr className="sidebar-divider"/>

                    <li className="nav-item">
                        <Link className="nav-link" href="/panel/order/all">
                            <FontAwesomeIcon
                                icon={faNetworkWired}
                                style={{width: 16, color: '#e6e6e6', float: "right"}}
                            />
                            <span>Orders</span></Link>
                    </li>
                    <hr className="sidebar-divider"/>
                </ul>

                <div id="content-wrapper" className="d-flex flex-column">

                    <div id="content">

                        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                            <button id="sidebarToggleTop"
                                    onClick={() => setSidebarToggleTop(!sidebarToggleTop)}
                                    className="btn btn-link rounded-circle mr-3">
                                <FontAwesomeIcon
                                    icon={faBars}
                                    style={{width: 16, color: '#4e73df'}}
                                />
                            </button>


                            <ul className="navbar-nav ml-auto">


                                <div className="topbar-divider d-none d-sm-block"></div>

                                <li
                                    className={"nav-item dropdown no-arrow " + (dropdown.status ? 'show' : '')}
                                >
                                    <a className="nav-link dropdown-toggle" href="#" id="userDropdown"
                                       role="button"
                                       data-toggle="dropdown" aria-haspopup="true"
                                       aria-expanded={dropdown.status ? 'true' : 'false'}
                                       onClick={() => toggleDropdown(dropdown.status)}
                                    >
                                        <span
                                            className="mr-2 d-none d-lg-inline text-gray-600 small">{user ? user.username : "--"}</span>
                                        <Image
                                            src="/images/undraw_profile.svg"
                                            className="img-profile rounded-circle"
                                            width={150}
                                            alt="dddd"
                                            height={150}
                                        />
                                    </a>
                                    {dropdown.status && (
                                        <div
                                            className={"dropdown-menu dropdown-menu-right shadow animated--grow-in " + (dropdown.status ? 'show' : '')}
                                            aria-labelledby="userDropdown">
                                            <a className="dropdown-item p-2" href="#">
                                                <FontAwesomeIcon
                                                    icon={faUser}
                                                    style={{width: 20, color: '#000'}}
                                                />
                                                Profile
                                            </a>

                                            <div className="dropdown-divider"></div>

                                            <button
                                                onClick={logout}
                                                className="dropdown-item p-2"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faSignOutAlt}
                                                    style={{width: 20, color: '#000'}}
                                                />
                                                Logout
                                            </button>


                                        </div>
                                    )}

                                </li>

                            </ul>

                        </nav>

                        <div className="container-fluid">
                            {children}
                        </div>
                    </div>

                    <footer className="sticky-footer bg-white">
                        <div className="container my-auto">
                            <div className="copyright text-center my-auto">
                                <span>Copyright &copy; Your Website 2021</span>
                            </div>
                        </div>
                    </footer>

                </div>

            </div>


        </>
    );

}

export default SidebarPanel;
