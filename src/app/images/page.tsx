
import ImageIcon from '@mui/icons-material/Image';
import { Content } from './components/Content';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <div className="flex flex-col">
            <div className="flex gap-2 items-center mb-4">
                <ImageIcon className="text-[var(--titles)]" />
                <h1 className="text-2xl font-bold text-[var(--titles)]">Gestión de Imágenes</h1>
            </div>
            <Content />
        </div>
    );
}
