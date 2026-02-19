import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const [session, setSessions] = useState([]);
const [sessionsLoading, setSessionsLoading] = useState(false);

useEffect(() => {
    fetchSessions();
}, []);

const fetchSessions = async() => {
    try {
        setSessionsLoading(true);
        const response = await api.get('/auth/sessions');
        setSessions(response.data);
    } catch(error) {
        console.error('Error fetching sessions:', error);
    } finally {
        setSessionsLoading(false);
    }
};