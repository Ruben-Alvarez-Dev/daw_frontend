import React from 'react';
import Card from '../../../components/common/Card/Card';
import './CustomerProfile.css';

export default function CustomerProfile() {
    return (
        <div className="customer-profile">
            <Card
                header={<h3>Datos Personales</h3>}
            >
                <div className="profile-form">
                    {/* Profile form will go here */}
                </div>
            </Card>

            <Card
                header={<h3>Estadísticas</h3>}
            >
                <div className="profile-stats">
                    {/* Stats will go here */}
                </div>
            </Card>
        </div>
    );
}
