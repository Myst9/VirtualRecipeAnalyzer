import React from 'react';

// Create a Context Object
// A context object as the name suggest is a data type of an object that can be used to store information that can be shared to other components within the application.
// Context object is a different approach in passing information between components and allows easier access. 
//const UserContext = React.createContext();
// UserContext.js
const UserContext = React.createContext({ id: null, isAdmin: false });


// The "Provider" components allows other components to consume/use the context object and supply the necessary information needed to the context object.
export const UserProvider = UserContext.Provider;

export default UserContext;