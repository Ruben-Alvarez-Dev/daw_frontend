import React from 'react';
import Card from '../../../components/common/Card/Card';
import './AdminDashboardTools.css';

export default function AdminDashboardTools() {
    return (
        <Card
            header={<h3>Administrative Tools</h3>}
            body={
                <div className="admin-tools">
                    {/* Tools will be added here */}
                </div>
            }
        />
    );
}
