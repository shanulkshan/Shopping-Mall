import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Initial state
const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    error: null
};

// Action types
const AUTH_ACTIONS = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AUTH_ACTIONS.LOGIN_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        case AUTH_ACTIONS.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        case AUTH_ACTIONS.LOGOUT:
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };
        case AUTH_ACTIONS.SET_USER:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };
        case AUTH_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case AUTH_ACTIONS.CLEAR_ERROR:
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const checkAuthStatus = useCallback(async () => {
        try {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
            
            // Skip auth check if we're not in the browser environment
            if (typeof window === 'undefined') {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
                return;
            }
            
            const response = await fetch('http://localhost:3000/api/auth/me', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                dispatch({ 
                    type: AUTH_ACTIONS.SET_USER, 
                    payload: data.user 
                });
            } else {
                dispatch({ type: AUTH_ACTIONS.LOGOUT });
            }
        } catch (error) {
            // Don't log network errors during initial load - server might be starting
            if (error.message !== 'Failed to fetch') {
                console.error('Auth check failed:', error);
            }
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        } finally {
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
    }, []);

    // Check authentication status on app load
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const login = useCallback(async (email, password) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ 
                    type: AUTH_ACTIONS.LOGIN_SUCCESS, 
                    payload: { 
                        user: data.user, 
                        token: data.token 
                    } 
                });
                return { success: true, data };
            } else {
                dispatch({ 
                    type: AUTH_ACTIONS.LOGIN_FAILURE, 
                    payload: data.message || 'Login failed' 
                });
                return { success: false, error: data.message };
            }
        } catch (error) {
            const errorMessage = 'Network error. Please try again.';
            dispatch({ 
                type: AUTH_ACTIONS.LOGIN_FAILURE, 
                payload: errorMessage 
            });
            return { success: false, error: errorMessage };
        }
    }, []);

    const register = useCallback(async (userData, isFormData = false) => {
        try {
            dispatch({ type: AUTH_ACTIONS.LOGIN_START });

            const requestOptions = {
                method: 'POST',
                credentials: 'include',
                body: isFormData ? userData : JSON.stringify(userData)
            };

            // Only set Content-Type for JSON data, let browser set it for FormData
            if (!isFormData) {
                requestOptions.headers = {
                    'Content-Type': 'application/json',
                };
            }

            const response = await fetch('http://localhost:3000/api/auth/register', requestOptions);

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
                return { success: true, data };
            } else {
                dispatch({ 
                    type: AUTH_ACTIONS.LOGIN_FAILURE, 
                    payload: data.message || 'Registration failed' 
                });
                return { success: false, error: data.message };
            }
        } catch (error) {
            const errorMessage = 'Network error. Please try again.';
            dispatch({ 
                type: AUTH_ACTIONS.LOGIN_FAILURE, 
                payload: errorMessage 
            });
            return { success: false, error: errorMessage };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
    }, []);

    const updateProfile = useCallback(async (userData) => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ 
                    type: AUTH_ACTIONS.SET_USER, 
                    payload: data.user 
                });
                return { success: true, data };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            return { success: false, error: 'Network error. Please try again.' };
        }
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
    }, []);

    const value = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
