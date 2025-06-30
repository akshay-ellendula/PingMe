import { axiosInstance } from "./axios.js"
export const signupApi = async (signUpData) => {
    const response = await axiosInstance.post("/auth/signup", signUpData)
    return response.data;
}

export const authUserApi = async () => {
    try {
        const res = await axiosInstance.get("/auth/me")
        return res.data;
    } catch (error) {
        return null
    }
}

export const completeOnboardingApi = async (userData) => {
    const response = await axiosInstance.post("/auth/onBoarding", userData)
    return response.data;
}

export const loginApi = async (loginData) => {
    const response = await axiosInstance.post("/auth/signin", loginData)
    return response.data;
}

export const logoutApi = async () => {
    const response = await axiosInstance.post("/auth/logout")
    return response.data;
}

export const getRecommendedUsersApi = async () => {
    const response = await axiosInstance.get("/users")
    return response.data;
}
export const getUserFriendsApi = async () => {
    const response = await axiosInstance.get("/users/friends")
    return response.data;
}

export const ongoingFriendRequestsApi = async () => {
    const response = await axiosInstance.get("/users/on-going-requests")
    return response.data;
}

export const sendFriendRequestApi = async (userId) => {
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;
}

export const getFriendRequestApi = async () => {
    const response = await axiosInstance.get('/users/friend-requests');
    return response.data;
}
export const acceptRequestApi = async (requestId) => {
    const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
    return response.data
}

export const getStreamTokenApi = async() =>{
    const response = await axiosInstance.get('/chat/token');
    console.log(response.data)
    return response.data;
}