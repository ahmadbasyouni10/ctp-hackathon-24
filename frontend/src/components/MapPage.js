import RenderMap from "./RenderMap";
import { Box, useColorModeValue } from "@chakra-ui/react";

function MapPage() {
  return (
    <Box >
        {/* <Heading as="h2" fontSize="2xl" fontWeight="bold" p={4}>
            Interactive Resources Map
        </Heading>
        <Text fontSize="xl" p={4}>
            Explore the map below to find essential resources near your CUNY campus.
        </Text> */}
            <RenderMap />
    </Box>
  );
}

export default MapPage;