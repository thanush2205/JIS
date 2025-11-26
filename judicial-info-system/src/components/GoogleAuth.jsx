import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { UsersAPI } from '../services/api';

const GoogleAuth = ({ isSignup = false }) => {
  const navigate = useNavigate();
  const buttonRef = useRef(null);

  const handleCredentialResponse = async (response) => {
    const idToken = response.credential;
    try {
      const data = await UsersAPI.googleAuth(idToken);
      localStorage.setItem('auth', JSON.stringify({ token: data.token, user: data.user }));
      toast.success('Successfully logged in with Google!');
      
      // Redirect based on role after successful login/signup
      switch (data.user.role) {
        case 'judge':
          navigate('/judge');
          break;
        case 'lawyer':
          navigate('/lawyer');
          break;
        case 'police':
          navigate('/police');
          break;
        case 'registrar':
            navigate('/registrar');
            break;
        default:
          navigate('/user');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google authentication failed. Please try again.';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    // Ensure Google Identity script is loaded
    if (typeof window === 'undefined') return;
    const google = window.google;
    if (!google || !google.accounts || !google.accounts.id) {
      console.warn('Google Identity Services script not loaded');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('VITE_GOOGLE_CLIENT_ID is not set');
      return;
    }

    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      if (buttonRef.current) {
        google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: isSignup ? 'signup_with' : 'signin_with',
        });
      }
    } catch (err) {
      console.error('Error initializing Google Identity Services', err);
      toast.error('Unable to load Google Sign-In. Please try again later.');
    }
  }, [isSignup]);

  return (
    <div className="w-full mt-4 flex justify-center">
      <div ref={buttonRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
    </div>
  );
};

export default GoogleAuth;
