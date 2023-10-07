import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate,Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Register() {

    const {user} = useContext(UserContext);

    //an object with methods to redirect the user
    const navigate = useNavigate();

    // State hooks to store the values of the input fields
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isActive, setIsActive] = useState('');

    // Check if values are successfully binded
    console.log(email);
    console.log(password1);
    console.log(password2);

    // Function to simulate user registration
    function registerUser(e) {

        // Prevents page redirection via form submission
        e.preventDefault();

        fetch(`${process.env.REACT_APP_API_URL}/users/checkEmail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(res => res.json())
        .then(data => {

            console.log(data);

            if(data === true){

                Swal.fire({
                    title: 'Duplicate email found',
                    icon: 'error',
                    text: 'Please provide a different email.'   
                });

            } else {

                fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password1
                    })
                })
                .then(res => res.json())
                .then(data => {

                    console.log(data);

                    if(data === true){

                        // Clear input fields
                        setEmail('');
                        setPassword1('');
                        setPassword2('');

                        Swal.fire({
                            title: 'Registration successful',
                            icon: 'success',
                            text: 'Welcome to Virtual Recipe Store!'
                        });

                        // Allows us to redirect the user to the login page after registering for an account
                        navigate("/recipes");

                    } else {

                        Swal.fire({
                            title: 'Something went wrong',
                            icon: 'error',
                            text: 'Please try again.'   
                        });

                    };

                })
            };

        })

    }

    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if((email !== '' && password1 !== '' && password2 !== '') && (password1 === password2)){
            setIsActive(true);
        } else {
            setIsActive(false);
        }

    }, [email, password1, password2]);

    return (
        (user.id !== null) ?
            <Navigate to="/products" />
        :
            <Form onSubmit={(e) => registerUser(e)}>
            <h1>Register</h1>

                <Form.Group controlId="userEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email"
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="password1">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Password"
                        value={password1} 
                        onChange={e => setPassword1(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password2">
                    <Form.Label>Verify Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Verify Password"
                        value={password2} 
                        onChange={e => setPassword2(e.target.value)}
                        required
                    />
                </Form.Group>

                { isActive ? 
                    <Button variant="primary" type="submit" id="submitBtn">
                        Submit
                    </Button>
                    : 
                    <Button variant="danger" type="submit" id="submitBtn" disabled>
                        Submit
                    </Button>
                }
            </Form>
    )
    
}