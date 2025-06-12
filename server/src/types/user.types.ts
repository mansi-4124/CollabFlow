export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  googleId: string | null;
  avatar: string | null;
}

export interface IUserSignup {
  name: string;
  email: string;
  password: string;
}

export interface IUserGoogleSignup {
  name: string | undefined;
  email: string | undefined;
  googleId: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IGoogleAuth {
  idToken: string;
}
