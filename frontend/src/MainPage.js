import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useAuth } from "./AuthContext";

function MainPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("");
  const { getAuthHeader } = useAuth();

  const checkStatus = async () => {
    try {
      // API-Call, um den Login zu prüfen
      const response = await axios.post(
        "/api/is-up",
        {
          urlToCheck: url,
        },
        getAuthHeader()
      );

      if (response.status === 201) {
        setStatus(
          `Status Code: ${response.data.statusCode} \n Response Time: ${response.data.responseTime}ms\n Response: \n ${response.data.response}\n`
        );
      }
    } catch (error) {
      alert(
        `Ein Fehler ist aufgetreten bitte Versuchen sie es erneut. Status: ${error.response.status}`
      );
      console.error("Is Up error:", error);
    }
  };

  return (
    <Flex align="center" justify="center" height="100vh">
      <Box flex="1"></Box>
      <Box p={5} shadow="md" borderWidth="1px" flex="2" borderRadius="md">
        <Flex mb={4}>
          <Input
            mr={2}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL eingeben"
            size="md"
          />
          <Button onClick={checkStatus} colorScheme="blue">
            Check Status
          </Button>
        </Flex>
        <div style={{ whiteSpace: "pre-line" }}>{status}</div>
      </Box>
      <Box flex="1"></Box>
    </Flex>
  );
}

export default MainPage;
