import Head from "next/head";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "../css/login.module.css";

export default function About() {
    return (
        <>

            <Head>
                <title>ManagePetro | 404</title>
                <meta name="description" content="ManagePetro | About Us"/>
            </Head>
            <div className="header-website">
                <div className="container text-center">
                    <h1> 404!</h1>
                </div>
            </div>
            <div className="container">
                <div className="content-layout">

                    <Link href="/">
                        <Image
                            src="/images/404.png"
                            className={"img-fluid "}
                            width={1350}
                            alt="login"
                            height={550}
                        />
                    </Link>
                </div>
            </div>
        </>
    );
}

