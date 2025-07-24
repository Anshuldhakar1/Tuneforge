type AppLogoProps = {
    className?: string;
};

const AppLogo = ({ className }: AppLogoProps) => (
    <svg
        width="100"
        height="60"
        viewBox="0 0 100 60"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <defs>
            <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
            </linearGradient>
            
            <linearGradient id="noteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#34d399', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 0.6 }} />
            </linearGradient>
        </defs>
        
        <circle cx="50" cy="30" r="22" fill="url(#playGradient)" opacity="0.1"/>
        <circle cx="50" cy="30" r="18" fill="url(#playGradient)" stroke="#ffffff" strokeWidth="1" opacity="0.95"/>
        <circle cx="60" cy="22" r="4" fill="white" opacity="0.15"/>
        <circle cx="43" cy="38" r="3" fill="white" opacity="0.2"/>
        <circle cx="57" cy="40" r="2.5" fill="white" opacity="0.25"/>
        <polygon points="45,22 45,38 59,30" fill="white" opacity="0.9"/>
    </svg>
)

export default AppLogo;