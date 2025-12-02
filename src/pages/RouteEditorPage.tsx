import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import RouteForm from '../components/RouteForm';
import { useRouteStore } from '../store/routeStore';

export default function RouteEditorPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getRoute, addRoute, updateRoute } = useRouteStore();

    const isEditing = !!id;
    const route = isEditing ? getRoute(Number(id)) : undefined;

    useEffect(() => {
        if (isEditing && !route) {
            navigate('/routes');
        }
    }, [isEditing, route, navigate]);

    const handleSave = (data: any) => {
        if (isEditing && id) {
            updateRoute(Number(id), data);
        } else {
            addRoute(data);
        }
        navigate('/routes');
    };

    const handleCancel = () => {
        navigate('/routes');
    };

    if (isEditing && !route) {
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    startIcon={<ArrowLeft size={20} />}
                    onClick={handleCancel}
                    color="inherit"
                    size="medium"
                >
                    返回
                </Button>
                <Typography variant="h5" fontWeight="bold">
                    {isEditing ? '编辑线路' : '新增线路'}
                </Typography>
            </Box>

            <RouteForm
                route={route}
                onSave={handleSave}
                onCancel={handleCancel}
            />
        </Container>
    );
}
