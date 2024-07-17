import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const CallBackHandler = () => {
    const { search } = useLocation();
    const params = useMemo(() => new URLSearchParams(search), [search]);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = params?.get("access_token") || "";
        localStorage.setItem("qrg:access-token", accessToken);
        navigate('/dashboard');
    }, [params,navigate])
    
 return null
}

export default CallBackHandler
