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
}

export default function Modal({ title, children, sendAction, open, setOpen, status, loading }: ModalProps) {

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
                {status && <span className='mr-4 text-sm'>{status}</span>}
                <Button onClick={handleClose} color="error" variant="outlined">Cancelar</Button>
                <Button type="submit" form="subscription-form" color="success" variant="outlined" loading={loading}>
                    {sendAction}
                </Button>
            </DialogActions>
        </Dialog>

    );
}
