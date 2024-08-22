import { Flex } from '@chakra-ui/react';
import { Outlet, useLocation } from "@remix-run/react";
import {AnimatePresence, motion} from 'framer-motion';
import { Container, Nav, NavItem, Page } from './shared-components';
import { IconItem } from './types';

const MotionOutlet = motion(Outlet);

export const Navigation = ({ topItems, bottomItems }: { topItems: IconItem[]; bottomItems: IconItem[] }) => {
    const location = useLocation();
    return (
        <Container>
            <Nav>
                <Flex direction='column' gap={5} marginTop={5}>
                    {topItems.map(item => NavItem(item))}
                </Flex>
                <Flex direction='column' gap={5} marginBottom={5}>
                    {bottomItems.map(item => NavItem(item))}
                </Flex>
            </Nav>
            <Page>
                <AnimatePresence mode='wait' initial={false}>
                    <MotionOutlet
                        key={location.pathname}
                        initial={{x: '0', opacity: 0}}
                        animate={{x: '0', opacity: 1}}
                        exit={{y: '0', opacity: 0}}
                        transition={{duration: 0.3}}
                    />
                </AnimatePresence>
            </Page>
        </Container>
    )
}