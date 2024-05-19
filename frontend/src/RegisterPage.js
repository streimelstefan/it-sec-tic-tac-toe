import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Link,
} from "@chakra-ui/react";

function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const success = await register(
      username,
      password,
      firstName,
      lastName,
      email
    );
    if (success) {
      navigate("/main");
    } else {
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <VStack spacing={4}>
          <FormControl id="firstname">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Name eingeben"
            />
          </FormControl>
          <FormControl id="lastname">
            <FormLabel>Nachname</FormLabel>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nachname eingeben"
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email eingeben"
            />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Benutzername</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Benutzername eingeben"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Passwort</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort eingeben"
            />
          </FormControl>
          <Button width="full" onClick={handleLogin} colorScheme="blue">
            Register
          </Button>
          <Link href="/login">Or Login</Link>
        </VStack>
      </Box>
    </Flex>
  );
}

export default RegisterPage;
