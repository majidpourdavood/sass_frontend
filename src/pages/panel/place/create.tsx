import React, {useCallback, useMemo, useRef, useState} from 'react';
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

import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import {Icon} from "leaflet";

function CreatePlace(props) {

    const auth = useAppSelector((state) => state.auth);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required')
            .min(3, "name must be at least 3 characters")
            .max(1000, "name must be at least 1000 characters")
        ,
        lat: Yup.string().required('lat is required'),
        lng: Yup.string().required('lng is required'),
    });

    const [initialValues, setInitialValues] = useState({
        name: "place 1",
    });
    const center = {
        lat: 35.79957624375943,
        lng: 51.41704559326172,
    }
    const [position, setPosition] = useState(center)

    const router = useRouter();
    const [errors, setErrors] = useState({
        name: "",
    });


    const model = {
        name: initialValues.name,
        lat: position.lat.toString(),
        lng: position.lng.toString(),
    }


    let userToken = auth.user ? auth.user.token : "";
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
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_STORE_Place

        console.log(model)
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
                    router.push('/panel/place/all');
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
    // marker

    function DraggableMarker() {
        const [draggable, setDraggable] = useState(true)
        const markerRef = useRef(null)
        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        setPosition(marker.getLatLng())
                        // let getLatLng = marker.getLatLng();
                        // setInitialValues({
                        //     ...initialValues,
                        //     lat: getLatLng.lat.toString(),
                        //     lng: getLatLng.lng.toString()
                        // })
                        // console.log(getLatLng)
                        // console.log(initialValues)

                    }
                },
            }),
            [],
        )



        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)

        }, [])
        const customIcon = new Icon({
            iconUrl: "https://woodlandstrailriding.com.au/wp-content/uploads/2017/10/map-marker-blue.png",
            // iconUrl: require("public/images/map-marker-blue.png"),
            iconSize: [50, 80], // size of the icon
        })
        return (
            <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}
                icon={customIcon}
                ref={markerRef}>
                <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
              ? 'Marker is draggable' + '  lat:' +position.lat+ '   lng:' +position.lng
              : 'Click here to make marker draggable'}
        </span>
                </Popup>
            </Marker>
        )
    }

    return (
        <>

            <Head>
                <title>ManagePetro | Create Place</title>
                <meta name="description" content="ManagePetro | Create Place"/>
            </Head>
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header d-flex align-items-center py-3">
                        <h6 className="m-0 font-weight-bold text-primary col-6">Create Places</h6>
                        <div className="text-right col-6">
                            <Link href="/panel/place/all" className="btn btn-primary">
                                all
                            </Link>
                        </div>
                    </div>
                    <div className="card-body">
                        <form
                            onSubmit={submitForm}
                            className=""
                        >

                            <div className="form-group row">
                                <div className="col-12">
                                    <label htmlFor="name">name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className={`form-control ${
                                            errors.name ? 'is-invalid' : ''
                                        }`}
                                        autoComplete="name"
                                        placeholder="name"
                                        id="name"
                                        value={initialValues.name}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues, name: e.target.value})
                                        }
                                        autoFocus
                                    />
                                    <div className="invalid-feedback">{errors.name}</div>

                                </div>
                            </div>


                            <MapContainer center={center} zoom={13} scrollWheelZoom={false}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <DraggableMarker/>
                            </MapContainer>

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


export default CreatePlace;
