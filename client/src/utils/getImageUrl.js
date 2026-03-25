export const getImageUrl = (path) => {
    if (!path) return null;

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    if (path.startsWith('/avatars/')) {
        return path;
    }

    if (path.startsWith('/uploads/')) {
        const API_BASE = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://192.168.232.247:5000';
        return `${API_BASE}${path}`;
    }

    return path;
};

export default getImageUrl;