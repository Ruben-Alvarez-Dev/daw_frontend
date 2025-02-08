import React from 'react';
import Card from '../../../components/common/Card/Card';
import CustomerPersonalData from '../Dashboard/CustomerPersonalData';
import CustomerStats from '../Dashboard/CustomerStats';
import './CustomerProfile.css';

const CustomerProfile = () => {
    return (
        <div className="customer-profile">
            <Card
                header={<h3>Datos Personales</h3>}
                body={<CustomerPersonalData />}
            />

            <Card
                header={<h3>Estadísticas</h3>}
                body={<CustomerStats />}
            />
        </div>
    );
};

export default CustomerProfile;
