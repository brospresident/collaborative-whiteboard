const express = require('express');
const axios = require('axios');
const _API_ADDR = `http://localhost:${process.env.PORT || 3000}/api`;

module.exports = {
    call_backend: function(body, callback) {
        if (!body) {
            callback('No JSON-RPC', null);
            return;
        }

        axios({
            method: 'post',
            data: body,
            url: _API_ADDR
        }).then(response => {
            if (response) {
                callback(null, response);
                return;
            }
        }).catch(rejected => {
            if (rejected) {
                callback(rejected, null);
                return;
            }
        });
    }
}