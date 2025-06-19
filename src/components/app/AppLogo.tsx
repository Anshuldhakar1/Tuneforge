type AppLogoProps = {
    className?: string;
};

const AppLogo = ({ className }: AppLogoProps) => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <circle cx="16" cy="16" r="14" fill="#28a745" />
        <polygon points="12,10 12,22 22,16" fill="white" />
        <circle cx="8" cy="8" r="1" fill="white" opacity="0.6" />
        <circle cx="24" cy="24" r="1" fill="white" opacity="0.6" />
    </svg>
)

export default AppLogo;