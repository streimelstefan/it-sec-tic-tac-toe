import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack
} from '@chakra-ui/react';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await login(username, password);
    if (success) {
      navigate('/main');
    } else {
      
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <FormControl id="username">
            <FormLabel>Benutzername</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Benutzername eingeben"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Passwort</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
            />
          </FormControl>
          <Button width="full" onClick={handleLogin} colorScheme="blue">Login</Button>
        </VStack>
      </Box>
    </Flex>
  );
}

export default LoginPage;
