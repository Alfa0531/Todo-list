"use client";
import { useState } from 'react';
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
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;
  }

  interface RegisterResponse {
    message?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password } as RegisterRequestBody)
      });

      const data: RegisterResponse = await res.json();

      if (res.ok) {
        setMessage('Registro exitoso.');
        route.push('/login');
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setMessage(data.message || 'Ocurrió un error en el registro.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error en la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Registro de Usuario
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              label="Nombre"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>
            {message && (
              <Alert severity={message === 'Registro exitoso.' ? 'success' : 'error'} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
