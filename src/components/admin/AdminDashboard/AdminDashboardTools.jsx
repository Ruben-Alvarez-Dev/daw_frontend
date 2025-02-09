import React, { useState } from 'react';
import Card from '../../common/Card/Card';
import Button from '../../common/Button/Button';
import AdminDashboardCalendar from './AdminDashboardCalendar';
import AdminDashboardTimeline from './AdminDashboardTimeline';
import './AdminDashboardTools.css';

export default function AdminDashboardTools() {
    const [activeView, setActiveView] = useState('calendar');

    const renderHeader = () => (
        <div className="admin-dashboard-tools__header">
            <Button 
                onClick={() => setActiveView('calendar')}
                variant={activeView === 'calendar' ? 'primary' : 'secondary'}
            >
                Calendario
            </Button>
            <Button 
                onClick={() => setActiveView('timeline')}
                variant={activeView === 'timeline' ? 'primary' : 'secondary'}
            >
                Timeline
            </Button>
        </div>
    );

    return (
        <Card
            header={renderHeader()}
            body={activeView === 'calendar' ? <AdminDashboardCalendar /> : <AdminDashboardTimeline />}
        />
    );
}
