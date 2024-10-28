import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import Head from 'next/head'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import qs from 'querystring';
import axios from 'axios';
import {constants} from '../../../utils/constants';
import Link from 'next/link';
import {useAppSelector} from "../../../redux/slices/hooks";
import {toast} from "react-toastify";


function Deliveries(props) {

    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);
    let userToken = auth.user ? auth.user.token : "";



    function onDelete(id) {
        let message = "";
        let bearer = 'Bearer ' + userToken;
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_DELETE_Delivery;
        axios.delete(url + id,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": bearer
                },
            }
        )
            .then(res => {
                if (res.data.status && res.data.status == "success") {
                    message = res.data.message;
                    toast.success(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                    router.push({
                        pathname: router.pathname,
                    });
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
        })
    }

    if (props.deliveries && props.deliveries.status == "success") {
        return (
            <>
                <Head>
                    <title>ManagePetro | All Delivery</title>
                    <meta name="description" content="ManagePetro | All Delivery"/>
                </Head>
                <div className="container-fluid">

                    <div className="card shadow mb-4">
                        <div className="card-header d-flex align-items-center py-3">
                            <h6 className="m-0 font-weight-bold text-primary col-6">Deliveries</h6>
                            <div className="text-right col-6">
                                <Link href="/panel/delivery/create" className="btn btn-primary">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{width: 16, color: '#fff', marginRight: 5}}
                                    />
                                    Create
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                    <thead>
                                    <tr>
                                        <th>row</th>
                                        <th>name</th>
                                        <th>capacity</th>
                                        <th>setting</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {props.deliveries.data.map((delivery, key) => {
                                        return (

                                            <tr key={key + 1}>
                                                <td>{key + 1}</td>
                                                <td>{delivery.name}</td>
                                                <td>{delivery.capacity}</td>

                                                <td>
                                                    <ul className="list-inline">
                                                        <li className="list-inline-item">
                                                            <button className="btn btn-danger"
                                                                    onClick={() => onDelete(delivery.id)}>
                                                                Delete
                                                            </button>
                                                        </li>

                                                        <li className="list-inline-item">
                                                            <Link href={"/panel/delivery/edit/" + delivery.id}
                                                                  className="btn btn-warning">
                                                                Edit
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </td>
                                            </tr>

                                        );
                                    })}
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>

                </div>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>ManagePetro | All Deliveries</title>
                    <meta name="description" content="ManagePetro | All Deliveries"/>
                </Head>
                <div className="container-fluid">

                    <div className="card shadow mb-4">
                        <div className="card-header d-flex align-items-center py-3">
                            <h6 className="m-0 font-weight-bold text-primary col-6">Deliveries</h6>
                            <div className="text-right col-6">
                                <Link href="/panel/delivery/create" className="btn btn-primary">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        style={{width: 16, color: '#fff', marginRight: 5}}
                                    />
                                    Create
                                </Link>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">

                                <h3>Not Get Data</h3>
                            </div>
                        </div>
                    </div>

                </div>
            </>
        )
    }

}

export async function getServerSideProps({req, query}) {
    let data;
    try {
        const cookies = qs.decode(req.headers.cookie, "; ")
        let user = JSON.parse(cookies.user as string);
        // console.log(user)
        if (!user) {
            return {props: {users: null}}
        }
        let bearer = 'Bearer ' + user.token;

        const url = process.env.URL_WEBSITE_SERVER + constants.URL_ALL_Delivery
        data = await axios(url, {
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
        data = error.toString();
    }

    return {props: {deliveries: data}}
}

export default Deliveries;
