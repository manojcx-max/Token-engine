export const getSessionId = () => {
    let sessionId = localStorage.getItem('tokenengine_session_id');
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('tokenengine_session_id', sessionId);
    }
    return sessionId;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const trackEvent = async (event: string) => {
    const sessionId = getSessionId();
    try {
        await fetch(`${API_URL}/api/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, event, timestamp: new Date() })
        });
    } catch (e) {
        console.error('Failed to track event', e);
    }
};

export const submitSurvey = async (priceTier: string) => {
    const sessionId = getSessionId();
    try {
        await fetch(`${API_URL}/api/survey`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, priceTier })
        });
    } catch (e) {
        console.error('Failed to submit survey', e);
    }
};

export const joinWaitlist = async (email: string, name: string, role?: string, priceTier?: string) => {
    const sessionId = getSessionId();
    try {
        const response = await fetch(`${API_URL}/api/waitlist`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, email, name, role, priceTier })
        });
        return response.ok;
    } catch (e) {
        console.error('Failed to join waitlist', e);
        return false;
    }
};
