import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <Container className="min-h-screen max-h-max bg-zinc-800" maxWidth={false}>
            <Outlet/>
        </Container>
    );
}

export default MainLayout;