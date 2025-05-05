import { createContext, useContext, useEffect, useState } from "react";
import { toast,Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../App.jsx";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isWalletRegistration, setIsWalletRegistration] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showOtpCard, setShowOtpCard] = useState(false);
    const [isAuth, setIsAuth] = useState(false);

    const handleSubmit = async (e, formData) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
    
        try {
            if (formData.password !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const { data } = await axios.post(`${server}/register`, formData);
            
            if (!data.verifyToken) {
                throw new Error('No verification token received');
            }

            localStorage.setItem("verifyToken", data.verifyToken);
            setSuccess('OTP sent to your email. Please verify.');
            setShowOtpCard(true);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
            toast.error(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpSubmit = async (e, otp, navigate) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
    
        try {
            const verifyToken = localStorage.getItem("verifyToken");
            if (!verifyToken) {
                throw new Error('No verification token found');
            }

            const verification = {
                otp: otp,
                verifyToken: verifyToken
            };

            const { data } = await axios.post(`${server}/verify`, verification);
            
            if (!data.token) {
                throw new Error('No authentication token received');
            }

            localStorage.clear();
            localStorage.setItem("token", data.token);
            setIsAuth(true);
            setSuccess('Account created successfully! Redirecting...');
            toast.success('Account created successfully!');
            
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'OTP verification failed');
            toast.error(err.response?.data?.message || err.message || 'OTP verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isWalletLogin, setIsWalletLogin] = useState(false);
    const [errLog, setErrLog] = useState('');

    const handleEmailLogin = async (e,email,password,navigate) => {
        e.preventDefault();
        setIsLoading(true);
        setErrLog('');
        
        try {
          // Here you would typically call your backend API
          // For demo, we'll just simulate a successful login
          const {data} = await axios.post(`${server}/login`, {
            email: email,
            password: password
            });
          
          if(data.success){
            localStorage.clear();
            localStorage.setItem("token", data.token);
            setIsAuth(true);
            toast.success(data.message);
            navigate('/dashboard');
          }

        } catch (err) {
          setErrLog('Invalid email or password');
        } finally {
          setIsLoading(false);
        }
      };
    
    const [user, setUser] = useState([]);

    // const [isFetching, setIsFetching] = useState(false);
    const fetchUser = async () => {
        setIsLoading(true);
        try{
            if(localStorage.getItem("token")){
                const {data} = await axios.post(`${server}/me`, {
                    token: localStorage.getItem("token")
                })

                if(data.success){
                    setIsAuth(true);
                    setUser(data.user);
                }
            }
        }catch(err){
            toast.error(err.message);
        }
        setIsLoading(false);
    }

    const logout = (navigate) => {
        try{
            localStorage.removeItem("token");
            setIsAuth(false);
            setUser([]);
            navigate('/');
        }catch(err){
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{
            isWalletRegistration,
            setIsWalletRegistration,
            handleSubmit,
            isLoading,
            setIsLoading,
            error,
            success,
            showOtpCard,
            setShowOtpCard,
            handleOtpSubmit,
            isAuth,
            email,
            password,
            isWalletLogin,
            setIsWalletLogin,
            handleEmailLogin,
            errLog,
            setErrLog,
            setEmail,
            setPassword,
            user,
            logout
        }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);



