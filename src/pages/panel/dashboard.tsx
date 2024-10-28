import {useAppDispatch, useAppSelector} from '../../redux/slices/hooks';
import React, {useState} from 'react';
import Head from 'next/head'
import Link from "next/link";
import qs from "querystring";
import {constants} from "../../utils/constants";
import axios from "axios";

const Dashboard = (props) => {
    const auth = useAppSelector((state) => state.auth);



    let userToken  = auth.user ? auth.user : "";

    return (

        <>
            <Head>
                <title>Hoshe Sabz | Dashboard</title>
                <meta name="description" content="Hoshe Sabz | Dashboard"/>
            </Head>

            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>

            </div>


            <div className="row">

                <div className="col-lg-12 mb-4">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Panel guide</h6>
                        </div>
                        <div className="card-body">
                            <p>

                            </p>
<div className="row col-12">
    <div className="col">
        <Link className={"btn mt-4 btn-join-us btn-admin-dashboard"} href="/panel/user/all">
            All User
        </Link>
    </div>

    <div className="col">
        <Link className={"btn mt-4 btn-join-us btn-admin-dashboard btn-admin-dashboard-three"} href="/panel/delivery/all">
            All Delivery
        </Link>
    </div>

    <div className="col">
        <Link className={"btn mt-4 btn-join-us btn-admin-dashboard btn-admin-dashboard-two"} href="/panel/order/all">
            All Order
        </Link>
    </div>

    <div className="col">
        <Link className={"btn mt-4 btn-join-us btn-admin-dashboard btn-admin-dashboard-one"} href="/panel/place/all">
            All Place
        </Link>
    </div>
</div>



                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};


export default Dashboard;
