import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import qs from 'querystring';
import axios from 'axios';
import {constants} from '../../../../utils/constants';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from "../../../../redux/slices/hooks";
import {toast} from "react-toastify";
import * as Yup from "yup";
import Head from "next/head";

function UpdateUser(props) {

    const auth = useAppSelector((state) => state.auth);

    const validationSchema = Yup.object().shape({

        username: Yup.string().required('username is required')
            .min(3, "username must be at least 3 characters")
            .max(1000, "username must be at least 1000 characters")
        ,

    });

    const [initialValues, setInitialValues] = useState({
        roles: props ? props.getUser.data.roles : "",
        username: props ? props.getUser.data.username : "",
        password:  ""

    });

    const [checkedIds, setCheckedIds] = useState(props ? props.getUser.data.roles : []);

    const handlechange = (e) => {
        const clickedId = e.target.value;
        if (checkedIds.includes(clickedId)) {
            setCheckedIds(checkedIds.filter((id) => id !== clickedId));
        } else {
            setCheckedIds([...checkedIds, clickedId]);
        }
    };

    const isChecked = (name: string) => {
        return checkedIds.includes(name);
    };

    const router = useRouter();
    const [errors, setErrors] = useState({
        roles: "",
        username: "",
        password: ""
    });


    const user = {
        roles: checkedIds,
        username: initialValues.username,
        password: initialValues.password,
    }

    let userToken = auth.user ? auth.user.token : "";

    useEffect(() => {
       // console.log(props.getUser.data.roles)
        validateForm();
    }, [initialValues]);


    async function validateForm() {

        await validationSchema.validate(user, {abortEarly: false}).catch(function (err) {
            for (var key in user) {
                if (user.hasOwnProperty(key)) {
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


        let isValid = await validationSchema.isValid(user);
        if (!isValid) {
            toast.error("Error In Validation", {
                position: 'top-right',
                autoClose: 3000,
                theme: 'colored',
            });
            return false;
        }

        let bearer = 'Bearer ' + userToken;
        let userId = props.getUser ? props.getUser.data.id : "";
        let message = "";
        const url = process.env.URL_WEBSITE_SERVER + constants.URL_UPDATE_USER + userId
        axios.patch(url, user,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    "Authorization": bearer
                },
            })
            .then(res => {
console.log(res)
                if (res.data.status && res.data.status == "success") {
                    message = res.data.message;
                    toast.success(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                    router.push('/panel/user/all');
                } else {
                    message = res.toString();
                    toast.warning(message, {
                        position: 'top-right',
                        autoClose: 3000,
                        theme: 'colored',
                    });
                }

            }).catch(error => {
            console.log(user)
            console.log(error)

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
        <>
            <Head>
                <title>ManagePetro | Edit User</title>
                <meta name="description" content="ManagePetro | Edit User"/>
            </Head>
            <div className="container-fluid">
                <div className="card shadow mb-4">
                    <div className="card-header d-flex align-items-center py-3">
                        <h6 className="m-0 font-weight-bold text-primary col-6">Edit User</h6>
                        <div className="text-right col-6">
                            <Link href="/panel/user/all" className="btn btn-primary">
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
                                    <label htmlFor="username">username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className={`form-control ${
                                            errors.username ? 'is-invalid' : ''
                                        }`}
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


                            <div className="form-group row">
                                <div className="col-12">
                                    <label htmlFor="password">password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`form-control ${
                                            errors.password ? 'is-invalid' : ''
                                        }`}
                                        autoComplete="password"
                                        placeholder="password"
                                        id="password"
                                        value={initialValues.password}
                                        onChange={(e) =>
                                            setInitialValues({...initialValues, password: e.target.value})
                                        }
                                        autoFocus
                                    />
                                    <div className="invalid-feedback">{errors.password}</div>

                                </div>
                            </div>


                            <div className=" form-group row">
                                <div className=" col-12">
                                    <label htmlFor="roles">roles</label>

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
                                                        checked={isChecked(role.name)}
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


export async function getServerSideProps({req, res, params}) {
    let data;
    let getUser;

    try {
        const cookies = qs.decode(req.headers.cookie, "; ")
        let user = JSON.parse(cookies.user as string);
        if (!user) {
            return {
                props: {
                    roles: null,
                    getUser: null,
                }
            }
        }
        let bearer = 'Bearer ' + user.token;


        const idUser = params.id;
        const urlGetUser = process.env.URL_WEBSITE_SERVER + constants.URL_GET_USER + idUser;

        getUser = await axios(urlGetUser, {
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
        return error.toString();
    }

    return {
        props: {
            getUser: getUser,
        }
    }
}

export default UpdateUser;
