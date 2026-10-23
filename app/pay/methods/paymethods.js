
import React, { useState } from "react";
import axios from 'axios';

 const isLocalhost = process.env.NEXT_PUBLIC_ISLOCALHOST === 'true';
const localhost = 'http://localhost:5000';
const remoteserver = process.env.NEXT_PUBLIC_API_URL;
const server = isLocalhost ? localhost : remoteserver;

export const yemeniRials = () => {
    return axios.get(`${server}/getexchangeDolar`);
};



