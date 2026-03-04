const LoadingSpinner = ({ message = 'Loading...' }) => {
    return (
        <div style = {{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh'
        }}>
            <div className="loading neon-text">
                {message}
            </div>
        </div>
    );
};

export default LoadingSpinner;