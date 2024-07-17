import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

const sendCredentials = async (credentials) => {
  try {
    const response = await fetch('http://localhost:8080/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Server response:', result);
  } catch (error) {
    console.error('Error sending credentials:', error);
  }
};

const LoginComp = () => {
  const { loginWithRedirect, logout, isAuthenticated, user ,} = useAuth0();
  console.log(user)

  useEffect(() => {
    const sendUserCredentials = async () => {
      if (isAuthenticated) {
        const credentials = {
          
          nickname: user.nickname || user.name, // use nickname if available, otherwise use name
          name: user.name,
          email: user.email,
        };
        console.log('Sending credentials:', credentials);

        await sendCredentials(credentials);
      }
    };

    sendUserCredentials();
  }, [isAuthenticated, user]);
  

  return (
    <div>
      
      {!isAuthenticated ? (
        <button className='navbar-button' onClick={() => loginWithRedirect()}>Log In</button>
      ) : (
        <button className='navbar-button' onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
      )}
    </div>
  );
};

export default LoginComp;
