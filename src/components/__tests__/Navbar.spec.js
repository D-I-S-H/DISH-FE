import { mount } from '@vue/test-utils';
import Navbar from '@/components/navComponent.vue';
import { describe, it, expect, vi, beforeEach, toBe } from 'vitest';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createRouter, createWebHistory } from 'vue-router';
import { routes } from '@/main';

import axios from 'axios';
vi.mock('axios');

// Create router mock
const router = createRouter({
  history: createWebHistory(),
  routes
});

describe('navComponent.vue', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        components: {
          FontAwesomeIcon,
        },
      },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('a.navbar-brand').text()).toBe('D.I.S.H');
  });

  it('shows login form when uid is not present', async () => {
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        components: {
          FontAwesomeIcon,
        },
      },
    });

    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toBe('Sign In');
  });

  it('calls signIn function on form submission', async () => {
    const mockResponse = { data: { uid: 1, user: { name: 'Test User' } } };
    axios.post.mockResolvedValueOnce(mockResponse);

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        components: {
          FontAwesomeIcon,
        },
      },
    });

    // Simulate user input
    await wrapper.find('input#username').setValue('testuser');
    await wrapper.find('input#password').setValue('password123');

    await wrapper.find('form').trigger('submit.prevent');

    // Assert axios.post was called with correct credentials
    expect(axios.post).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_API_URL}/login`, {
      username: 'testuser',
      password: 'password123',
    });

    // Assert uid is stored in localStorage
    expect(localStorage.getItem('uid')).equals("1");
    expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
  });

  it('hides login form when uid is present', async () => {
    localStorage.setItem('uid', 1);
  
    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
        components: {
          FontAwesomeIcon,
        },
      },
    });
  
    await wrapper.vm.$nextTick(); // Wait for the DOM to fully update
  
    expect(wrapper.find('form').exists()).toBe(false);
  });
});
