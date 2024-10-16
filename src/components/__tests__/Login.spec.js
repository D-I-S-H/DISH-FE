import { mount } from '@vue/test-utils';
import Login from '@/views/Login.vue'; // Adjust the path to your actual file
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { createRouter, createWebHistory } from 'vue-router';

vi.mock('axios'); // Mock axios

// Mock router
const mockRouterPush = vi.fn();
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
  ],
});
router.push = mockRouterPush;

describe('Login.vue', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('renders the sign-in form correctly', () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });

    // Check if the form and input fields are rendered
    expect(wrapper.find('h5').text()).toBe('Sign In');
    expect(wrapper.find('input#username').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Sign In');
  });

  it('calls the signIn method on form submission', async () => {
    const mockResponse = { data: { token: 'fake-token', user: { name: 'Test User' } } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });

    // Simulate user input
    await wrapper.find('input#username').setValue('testuser');
    await wrapper.find('input#password').setValue('password123');

    // Simulate form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Assert axios.post was called with the correct credentials
    expect(axios.post).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/login`, {
      username: 'testuser',
      password: 'password123',
    });

    // Assert token is stored in localStorage
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));

    // Check if router.push was called to redirect
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('shows an error message when login fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Login failed'));

    const wrapper = mount(Login, {
      global: {
        plugins: [router],
      },
    });

    // Simulate user input
    await wrapper.find('input#username').setValue('invaliduser');
    await wrapper.find('input#password').setValue('wrongpassword');

    // Simulate form submission
    await wrapper.find('form').trigger('submit.prevent');

    // Assert axios.post was called with the wrong credentials
    expect(axios.post).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/login`, {
      username: 'invaliduser',
      password: 'wrongpassword',
    });

    // Check that no token is stored in localStorage
    expect(localStorage.getItem('token')).toBeNull();
  });
});
