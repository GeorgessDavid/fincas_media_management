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
}

export default function Modal({ title, children, sendAction, open, setOpen }: ModalProps) {

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
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" form="subscription-form">
                    {sendAction}
                </Button>
            </DialogActions>
        </Dialog>

    );
}
