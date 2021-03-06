import React, {
  createContext,
  useCallback,
  useState,
  useContext,
} from 'react';
import api from '../services/api';

interface IUser {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface IAuthState {
  token: string;
  user: IUser;
}

interface ISignInCredentials {
  email: string;
  password: string;
}

interface IAuthContextData {
  user: IUser;
  signIn(credentials: ISignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: IUser): void;
}

const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData,
);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@MyBackpack:token');
    const user = localStorage.getItem('@MyBackpack:user');

    if (token && user) {
      if (api.defaults.headers) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
      return { token, user: JSON.parse(user) };
    }

    return {} as IAuthState;
  });

  const signOut = useCallback(() => {
    localStorage.removeItem('@MyBackpack:token');
    localStorage.removeItem('@MyBackpack:user');

    setData({} as IAuthState);
  }, []);

  const signIn = useCallback(
    async ({ username, password }) => {
      // const response = await api.post('sessions', {
      //   username,
      //   password,
      // });
      // const { token, user } = response.data;
      // localStorage.setItem('@MyBackpack:token', token);
      // localStorage.setItem('@MyBackpack:user', JSON.stringify(user));
      // api.defaults.headers.authorization = `Bearer ${token}`;
      // setData({ token, user });
    },
    [],
  );

  const updateUser = useCallback(
    (user: IUser) => {
      // localStorage.setItem('@MyBackpack:user', JSON.stringify(user));
      // setData({
      //   token: data.token,
      //   user,
      // });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): IAuthContextData {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
