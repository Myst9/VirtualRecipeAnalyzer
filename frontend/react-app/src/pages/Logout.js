import { Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import UserContext from '../UserContext';

export default function Logout(){

	// Consume the UserContext object and destructure it to access the user state and unsetUser function from the context provider
	const { unsetUser, setUser } = useContext(UserContext);

	// Remove the email from the local storage.
	// localStorage.clear();

	// Clear the localStorage of the user's information
	unsetUser();

	// Using useEffect, will allow Logout page to render first before triggering the useEffect which changes the state of our user.
	useEffect(() => {
		// Set the user state back to it's original value
		setUser({id: null});
	});

	return (
		// After removing the email from the local storage, it will redirect us to /login
		<Navigate to="/login" />
	)
}