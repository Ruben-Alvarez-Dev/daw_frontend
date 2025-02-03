import Card from '../../common/Card/Card';
import AdminTableSelector from './AdminTableSelector';
import './AdminMaps.css';

export default function AdminMaps() {
    return (
        <div className="admin-maps">
            <Card
                header="Mesas"
                body={<AdminTableSelector />}
                footer="Lista de mesas"
            />
            <Card
                header="dos"
                body={<div>dos</div>}
                footer="dos"
            />
        </div>
    );
}
