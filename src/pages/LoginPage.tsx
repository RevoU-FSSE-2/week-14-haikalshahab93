import { TextField, Button, Grid, Typography, Paper, Link } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import { FormValues } from './types';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import React from 'react';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const initialValues = {
    email: '',
    password: '',
};

interface LoginPageProps {
    onSubmit: () => void;
}

const LoginForm: React.FC<LoginPageProps> = () => {

    const navigate = useNavigate();

    const handleSubmit = (values: FormValues) => {
        axios.post('https://mock-api.arikmpt.com/api/user/login', {
            email: values.email,
            password: values.password,
        }).then((response) => {
            console.log('Login successful', response.data);
            sessionStorage.setItem('userToken', response.data.data.token);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'You have successfully logged in. You will be redirected to dashboard shortly...',
            })
            setInterval(() => {
                window.location.replace('/dashboard')
            }, 3000);
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: `${error.response.status} Login Failed`,
                text: 'Invalid email or password. Please check your credentials and try again.',
            });
            if (error.response.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error',
                    text: 'Something went wrong. Please try again later',
                });
            }
        });
    };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={10} md={8}>
                <Paper elevation={3} style={{ padding: '30px' }}>
                    <Typography variant="h5" gutterBottom>
                        Login Page
                    </Typography>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="email"
                                    placeholder="Email"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <Field
                                    as={TextField}
                                    type="password"
                                    name="password"
                                    placeholder="Email"
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <Button data-testid="submitButton" type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }} fullWidth>
                                    Log In
                                </Button>

                            </Form>
                        )}
                    </Formik>
                    <Typography variant="body2" gutterBottom style={{ marginTop: "10px" }}>
                        If you don't have an account yet, <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/register')}
                        >
                            Register here
                        </Link>.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LoginForm;
