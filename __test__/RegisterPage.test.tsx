import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterPage } from '../src/pages';

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

describe('Unit testing in LoginForm', () => {

    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigateMock);

    test('should render title, username field, password field, and register button', () => {
        render(<RegisterPage />);

        const title = screen.getByText('Registration Page');
        expect(title).toBeDefined();

        const nameField = screen.getByLabelText('Name');
        expect(nameField).toBeDefined();

        const emailField = screen.getByLabelText('Email');
        expect(emailField).toBeDefined();

        const passwordField = screen.getByLabelText('Password');
        expect(passwordField).toBeDefined();

        const registerButton = screen.getByText('Register');
        expect(registerButton).toBeDefined();
    });

    test('should navigate to the login page when "Login here" link is clicked', () => {
        render(<RegisterPage />);
        const registerLink = screen.getByText('Login here');
        fireEvent.click(registerLink);

        expect(navigateMock).toHaveBeenCalledWith('/');
    });
});



