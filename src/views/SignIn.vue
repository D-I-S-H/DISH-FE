<template>
    <div class="container mt-5">
        <div class="card w-25 mx-auto">
            <div class="card-body">
                <h5 class="card-title">Sign In</h5>
                <form @submit.prevent="signIn">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" class="form-control" id="username" v-model="username" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" v-model="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary mt-3">Sign In</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

const API_URL = import.meta.env.API_URL;

export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        async signIn() {
            try {
                const response = await axios.post(`${API_URL}/login`, {
                    username: this.username,
                    password: this.password
                });
                // TODO: Store the token in the local storage, set the user in the store, and redirect to the home page
            } catch (error) {
                console.error('Login failed', error);
                // TODO: Show an error message to the user using a toast
            }
        }
    }
};
</script>
