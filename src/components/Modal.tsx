import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface ModalProps {
    open: boolean;
    title: string;
    children: React.ReactNode;
    sendAction: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    status?: string;
    loading?: boolean;
    buttonDisabled?: boolean;
    onConfirm?: (id: string) => void;
    color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

export default function Modal({ title, children, sendAction, open, setOpen, status, loading, buttonDisabled, onConfirm, color = "primary" }: ModalProps) {

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {status && <span className='m-4 italic text-sm'>{status}</span>}
                <Button onClick={handleClose} color="error" variant="outlined">Cancelar</Button>
                <Button type={onConfirm ? "button" : "submit"} form="subscription-form" color={color} variant="outlined" loading={loading} disabled={buttonDisabled || loading} onClick={onConfirm ? () => onConfirm("id") : undefined}>
                    {sendAction}
                </Button>
            </DialogActions>
        </Dialog>

    );
}
