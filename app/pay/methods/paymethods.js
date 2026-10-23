
import React, { useState } from "react";
import axios from 'axios';

const isLocalhostEnabled = process.env.REACT_APP_ISLOCALHOST === 'true';
// 2. استخدام متغيرات البيئة للرابطين (مع قيمة احتياطية للوكل هوست)
const localhost = process.env.REACT_APP_LOCAL_API_URL || 'https://tyraty-server.onrender.com';
// 3. إضافة قيمة احتياطية للسيرفر البعيد لتجنب الـ undefined
const remoteServer = process.env.REACT_APP_API_URL || 'https://tyraty-server.onrender.com';
// اختيار السيرفر
const server = isLocalhostEnabled ? localhost : remoteServer;

export const yemeniRials = () => {
    return axios.get(`${server}/getexchangeDolar`);
};



