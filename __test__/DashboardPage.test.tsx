import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {DashboardPage} from '../src/pages';
import axios from 'axios';
import { UserProfileProvider } from '../src/context/UserProfileContext';
import { act } from 'react-dom/test-utils';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

const mockCategories = [
    {
        id: 1,
        name: 'Category 1',
        is_active: true,
    },
    {
        id: 2,
        name: 'Category 2',
        is_active: false,
    },
];


jest.mock('../src/hooks/useFetchList', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        data: mockCategories,
        loading: false,
        error: false,
        refresh: jest.fn(),
    })),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));


beforeEach(() => {
    mock.onGet('https://mock-api.arikmpt.com/api/user/profile').reply(200, {
        data: {
            name: 'John Doe',
            email: 'johndoe@example.com',
        },
    });

    mock.onPost('https://mock-api.arikmpt.com/api/category/create').reply(201, {
        id: 3,
        name: 'Category 3',
        is_active: true,
    });
});


afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
});

describe('Unit testing in DashboardPage', () => {

    test('should render the profile component', async () => {

        await act(async () => {
            render(
                <UserProfileProvider>
                    <DashboardPage />
                </UserProfileProvider>
            );
        });

        const userProfile = screen.getByText('Name: John Doe');
        expect(userProfile).toBeDefined();

        const userEmail = screen.getByText('Email: johndoe@example.com');
        expect(userEmail).toBeDefined();

        const addCategoryButton = screen.getByTestId('addCategoryButton');
        expect(addCategoryButton).toBeDefined();

        const logOutButton = screen.getByText('Logout');
        expect(logOutButton).toBeDefined();
    });

    test('renders the table category component with initial data', async () => {

        await act(async () => {
            render(
                <UserProfileProvider>
                    <DashboardPage />
                </UserProfileProvider>
            );
        });

        await waitFor(() => screen.getByTestId('categoryTable'));

        const categoryTable = screen.getByTestId('categoryTable');
        expect(categoryTable).toBeDefined();

        const tableId = screen.getByText('ID');
        expect(tableId).toBeDefined();

        const tableName = screen.getByText('Name');
        expect(tableName).toBeDefined();

        const tableStatus = screen.getByText('Status');
        expect(tableStatus).toBeDefined();

        const initialData1 = screen.getByText('Category 1')
        expect(initialData1).toBeDefined();
        const initialData2 = screen.getByText('Category 2')
        expect(initialData2).toBeDefined();
    });

    test('renders the "Add Category" modal and submits data', async () => {
        await act(async () => {
            render(
                <UserProfileProvider>
                    <DashboardPage />
                </UserProfileProvider>
            );
        });

        const addCategoryButton = screen.getByTestId('addCategoryButton');
        fireEvent.click(addCategoryButton);

        const nameInput = screen.getByTestId('nameAddModal');
        const statusInput = screen.getByTestId('statusAddModal');
        const saveButton = screen.getByTestId('saveAddButtonModal');

        act(() => {
            fireEvent.change(nameInput, { target: { value: 'Category 3' } });
            fireEvent.change(statusInput, { target: { value: 'true' } });
            fireEvent.click(saveButton);
        });

        await waitFor(() => {
            expect(mock.history.post.length).toBe(1);
            expect(mock.history.post[0].data).toBe('{"name":"Category 3","is_active":true}');
        });

    });
});