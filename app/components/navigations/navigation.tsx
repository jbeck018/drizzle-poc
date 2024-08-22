import { Flex, Icon } from '@chakra-ui/react';
import { Outlet, useLocation, useSubmit } from "@remix-run/react";
import {AnimatePresence, motion} from 'framer-motion';
import { LogOut } from 'lucide-react';
import { ROUTE_PATH as LOGOUT_PATH } from '#app/routes/auth+/logout'
import { Container, Nav, NavItem, Page } from './shared-components';
import { IconItem } from './types';

const MotionOutlet = motion(Outlet);

export const Navigation = ({ topItems, bottomItems }: { topItems: IconItem[]; bottomItems: IconItem[] }) => {
    const location = useLocation();
    const submit = useSubmit()
    return (
        <Container>
            <Nav>
                <Flex direction='column' gap={5} marginTop={5}>
                    {topItems.map(item => NavItem(item))}
                </Flex>
                <Flex direction='column' gap={5} marginBottom={5}>
                    {bottomItems.map(item => NavItem(item))}
                    <Icon height={8} width={8} as={LogOut} onClick={() => submit({}, { action: LOGOUT_PATH, method: 'POST' })} />
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