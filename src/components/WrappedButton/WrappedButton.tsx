import './WrappedButton.css';

interface WrappedButtonProps {
    icon: React.ReactNode;
    title: string;
    text: string;
    onClick: () => void;
}

function WrappedButton({ icon, title, text, onClick }: WrappedButtonProps) {
    return (
        <div className="download-wrapper" onClick={onClick} title={title}>
            <div className="download-wrapper-button">
                <div className="download-button">
                    {icon}
                </div>
                <span>{text}</span>
            </div>
        </div>
    )
}

export default WrappedButton;