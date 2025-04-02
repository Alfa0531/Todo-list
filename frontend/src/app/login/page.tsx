"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  interface LoginResponse {
    token: string;
    user: Record<string, any>;
    message?: string;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: LoginResponse = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setErrorMessage(data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setErrorMessage('Error en la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              ¿No tienes cuenta?{' '}
              <Button color="primary" onClick={() => router.push('/register')}>
                Regístrate
              </Button>
            </Typography>
            {errorMessage && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
