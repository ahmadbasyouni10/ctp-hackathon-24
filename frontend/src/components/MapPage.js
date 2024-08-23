import { Box, Button, Heading, VStack, Text, Wrap, WrapItem } from '@chakra-ui/react';
import RenderMap from './RenderMap';

function MapPage() {
    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <VStack spacing={8}>
                <Text fontSize="3xl" fontWeight="bold" color="blue.500">Resources Map</Text>
                <Text fontSize="xl">This map contains some resources that are available across CUNY system!</Text>
                <Wrap justify="center" spacing={4}>
                    <WrapItem>
                        <RenderMap />
                    </WrapItem>
                </Wrap>
            </VStack>
        </Box>
    );
}

export default MapPage;
