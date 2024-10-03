import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const sendCredentials = async (credentials) => {
  try {
    const response = await fetch('http://localhost:8080/api/Login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Server response:', result);
    if(result.status){
      localStorage.setItem('token',result.token);
      console.log("token added")
    }
  } catch (error) {
    console.error('Error sending credentials:', error);
  }
};

const LoginComp = () => {
  const { loginWithRedirect, logout, isAuthenticated, user ,} = useAuth0();
 

  useEffect(() => {
    const sendUserCredentials = async () => {
      if (isAuthenticated) {
       
        const credentials = {
          
          nickname: user.nickname || user.name, // use nickname if available, otherwise use name
          name: user.name,
          email: user.email,
        };
        console.log('Sending credentials:', credentials);

      sendCredentials(credentials);
      const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
        
        if (!hasShownWelcome) {
          toast.success('Welcome!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });

          sessionStorage.setItem('hasShownWelcome', 'true');
        }
      }
    };
    
      sendUserCredentials();
    


  }, [isAuthenticated, user]);
 const  handlelogin = async() =>{
  
  await  loginWithRedirect()

 }
  
  const handlelogout = async() => {
    await logout({ returnTo: window.location.origin })
    sessionStorage.removeItem('hasReloaded');
    localStorage.removeItem('token'); 
    toast.info('👋 See you later!', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    
    navigate("/");
   
  }
  
  
  

  return (
    <div>
      
      {!isAuthenticated ? (
        <button className='navbar-button' onClick={handlelogin}>Log In</button>
      ) : (
        <button className='navbar-button' onClick={handlelogout}>Log Out</button>
      )}
       <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default LoginComp;
