export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  googleId: string | null;
  avatar: string | null;
}
