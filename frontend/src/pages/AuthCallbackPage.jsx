import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      let errorMessage = 'Authentication failed';
      if (error === 'authentication_failed') {
        errorMessage = 'Google authentication failed. Please try again.';
      } else if (error === 'server_error') {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      toast.error(errorMessage);
      navigate('/login');
      return;
    }

    if (token) {
      // Fetch user data with the token
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      // Store token first so the cookie is available
      document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
      
      fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch user data');
          }
          return res.json();
        })
        .then(data => {
          if (data.user) {
            // Store user info with token
            localStorage.setItem('user', JSON.stringify({ ...data.user, token }));
            toast.success('Successfully signed in!');
            navigate('/');
          } else {
            throw new Error('No user data received');
          }
        })
        .catch(err => {
          console.error('Auth callback error:', err);
          toast.error('Failed to complete sign in. Please try again.');
          navigate('/login');
        });
    } else {
      toast.error('No authentication token received');
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary mb-6" size={60} />
      <h2 className="text-xl font-semibold text-foreground">
        Completing sign in...
      </h2>
    </div>
  );
}

export default AuthCallbackPage;
