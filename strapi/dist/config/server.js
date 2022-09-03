"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    url: env('ADMIN_URL', 'http://localhost:1337'),
    proxy: true,
    app: {
        keys: env.array('APP_KEYS'),
    },
});
