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


function Places(props) {

    const router = useRouter();
    const auth = useAppSelector((state) => state.auth);
    let userToken = auth.user ? auth.user.token : "";


    function onDelete(id) {
        let message = "";
        let bearer = 'Bearer ' + userToken;
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_DELETE_Place;
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

    if (props.places && props.places.status == "success") {
        return (
            <>
                <Head>
                    <title>ManagePetro | All Place</title>
                    <meta name="description" content="ManagePetro | All Place"/>
                </Head>
                <div className="container-fluid">

                    <div className="card shadow mb-4">
                        <div className="card-header d-flex align-items-center py-3">
                            <h6 className="m-0 font-weight-bold text-primary col-6">Places</h6>
                            <div className="text-right col-6">
                                <Link href="/panel/place/create" className="btn btn-primary">
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
                                        <th>lat</th>
                                        <th>lng</th>
                                        <th>setting</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {props.places.data.map((place, key) => {
                                        return (

                                            <tr key={key + 1}>
                                                <td>{key + 1}</td>
                                                <td>{place.name}</td>
                                                <td>{place.lat}</td>
                                                <td>{place.lng}</td>

                                                <td>
                                                    <ul className="list-inline">
                                                        <li className="list-inline-item">
                                                            <button className="btn btn-danger"
                                                                    onClick={() => onDelete(place.id)}>
                                                                Delete
                                                            </button>
                                                        </li>

                                                        {/*<li className="list-inline-item">*/}
                                                        {/*    <Link href={"/panel/place/edit/" + place.id}*/}
                                                        {/*          className="btn btn-warning">*/}
                                                        {/*        Edit*/}
                                                        {/*    </Link>*/}
                                                        {/*</li>*/}
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
                    <title>ManagePetro | All Places</title>
                    <meta name="description" content="ManagePetro | All Places"/>
                </Head>
                <div className="container-fluid">

                    <div className="card shadow mb-4">
                        <div className="card-header d-flex align-items-center py-3">
                            <h6 className="m-0 font-weight-bold text-primary col-6">Places</h6>
                            <div className="text-right col-6">
                                <Link href="/panel/place/create" className="btn btn-primary">
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
        if (!user) {
            return {props: {users: null}}
        }
        let bearer = 'Bearer ' + user.token;

        const url = process.env.URL_WEBSITE_SERVER + constants.URL_ALL_Place
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

    return {props: {places: data}}
}

export default Places;
