import { Box, Divider, Flex, Text } from '@chakra-ui/react';
import {  Nav, NavItem } from './shared-components';
import { IconItem } from './types';

export const InnerNavigation = ({ items, title }: { title: string; items: IconItem[][] }) => {
    return (
        <Nav isInnerNav>
            <Text as={'h2'} fontWeight={700} fontSize='2xl' padding='20px 0px 0px 15px'>{title}</Text>
            <Divider orientation='horizontal' borderBottomWidth={2} width={'98%'} />
            {items.map((itemSet, index) => (
                <Box marginTop={index === 0 ? 2 : 0}>
                    <Flex direction='column' gap={5}>
                        {itemSet.map(item => NavItem({ ...item, isInnerNav: true }))}
                    </Flex>
                    {(index + 1) < items.length && <Divider />}
                </Box>
            ))}
        </Nav>
    )
}