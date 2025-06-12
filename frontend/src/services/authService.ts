import axios from "../lib/axios";

export const loginUserService = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post("/user/login", data);
  return res;
};

export const googleLoginService = async (idToken: string) => {
  const res = await axios.post("/user/google-login", { idToken });
  return res.data;
};

export const signupUserService = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post("/user/signup", data);
  return res.data;
};

export const googleSignupService = async (idToken: string) => {
  const res = await axios.post("/user/google-signup", { idToken });
  return res.data;
};

export const getUserByEmail = async (email: string) => {
  const response = await axios.get(`/user/${email}`, { withCredentials: true });
  return response.data;
};

export const searchUsers = async (query: string) => {
  if (!query) {
    return [];
  }
  const response = await axios.get(`/user/search/${query}`);
  return response.data.users;
};

export const getUserProjects = async () => {
  try {
    const response = await axios.get(`/user/projects`, {
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch user projects:", error);
    throw error;
  }
};
