import dotenv from 'dotenv'

dotenv.config()

// vue.config.js
module.exports = {
    publicPath: process.env.VITE_APP_BASE_PATH
};