import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { LoginPage } from '../src/pages';
import axios from 'axios';

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: { data: { token: 'fakeToken' } } })),
}));

describe('Unit testing in LoginForm', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    const mockProps = {
        onSubmit: jest.fn()
    }

    test('should render title, username field, password field, and login button', () => {
        render(<LoginPage onSubmit={mockProps.onSubmit} />);

        const title = screen.getByText('Login Page');
        expect(title).toBeDefined();

        const usernameField = screen.getByLabelText('Email');
        expect(usernameField).toBeDefined();

        const passwordField = screen.getByLabelText('Password');
        expect(passwordField).toBeDefined();

        const loginButton = screen.getByText('Log In');
        expect(loginButton).toBeDefined();
    });

    test('should navigate to the registration page when "Register here" link is clicked', () => {

        render(<LoginPage onSubmit={mockProps.onSubmit} />);
        const registerLink = screen.getByText('Register here');
        fireEvent.click(registerLink);

        expect(navigateMock).toHaveBeenCalledWith('/register');
    });

    test('should render login form and submit it', async () => {
        const { getByLabelText } = render(<LoginPage onSubmit={mockProps.onSubmit} />);

        const mockSetItem = jest.spyOn(Storage.prototype, 'setItem');

        act(() => {
            fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
            fireEvent.change(getByLabelText('Password'), { target: { value: 'password123' } });
            fireEvent.click(screen.getByText('Log In'));
        })

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });

        expect(mockSetItem).toHaveBeenCalledWith('userToken', 'fakeToken');
        expect(screen.getByText('Login Successful')).toBeDefined();
        expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
});



