import React, { FC } from "react";
import BaseLayout from "./BaseLayout";
import { Link } from 'react-router-dom';

interface Props {
    children?: React.ReactNode
}

const AdminLayout: FC<Props> = ({ children }) => {
    return (
        <BaseLayout>
            <div>
            <Link to='/admin' style={{ textDecoration: "none" }}>
                        <h2 style={{ fontSize: '30px', marginTop: '20px', marginBottom: '20px', fontWeight: 'bold' }}>
                            <span style={{ color: '#000000', fontFamily: 'sans-serif' }}>&lt;</span>
                            <span style={{ color: '#000000', fontFamily: 'sans-serif' }}>CODE ROOM</span>
                            <span style={{ color: '#000000', fontFamily: 'sans-serif' }}>/&gt;</span>
                             Admin Page
                        </h2>
                </Link>
            </div>
            <div>
                {children}
            </div>

        </BaseLayout>
    );
};

export default AdminLayout;