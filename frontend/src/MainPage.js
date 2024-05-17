import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Flex,
    Input,
    Text
  } from '@chakra-ui/react';

function MainPage() {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('');

    const checkStatus = async () => {
        setStatus(`Status: hello`);
        /*
        try {
            // API-Call, um den Login zu prüfen
            const response = await axios.post('/api/auth/login', { username, password });
            if (response.data.success) {
              setIsAuthenticated(true);
            } else {
              alert('Login fehlgeschlagen! Bitte überprüfen Sie Ihre Anmeldedaten.');
              setIsAuthenticated(false);
            }
          } catch (error) {
            alert('Ein Fehler ist aufgetreten beim Versuch, sich anzumelden.');
            console.error('Login error:', error);
            setIsAuthenticated(false);
          }
          */
    };

    return (
        <Flex align="center" justify="center" height="100vh">
            <Box p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md">
                <Flex mb={4}>
                    <Input
                        mr={2}
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="URL eingeben"
                        size="md"
                    />
                    <Button onClick={checkStatus} colorScheme="blue">Check Status</Button>
                </Flex>
                <Text fontSize="lg">{status}</Text>
            </Box>
        </Flex>
    );
}

export default MainPage;
