import axios from 'axios'; 

const ClientAxios = axios.create({ 
    // baseURL: 'http://127.0.0.1:8000/', 
    baseURL: 'http://13.51.176.197/', 
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' ,
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true // Enable credentials (cookies) with cross-domain requests
});

// Check if we have a token in cookies and set it as default
const token = document.cookie.split('; ').find(row => row.startsWith('access_token='));
if (token) {
    const accessToken = token.split('=')[1];
    ClientAxios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
}

// Function that was causing the CSRF error - now simplified to just return a resolved promise
export const getCsrfToken = async () => {
    // Return a resolved promise to keep existing code working
    return Promise.resolve();
};

export default ClientAxios;