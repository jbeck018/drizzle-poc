import { Icon, Text, Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled'
import { NavLink, useLocation } from '@remix-run/react';
import { startCase } from 'lodash-es';
import { IconItem } from './types';

export const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
`

export const Page = styled.div`
    width: calc(100vw - 60px);
`

export const Nav = styled.nav<{ isInnerNav?: boolean }>`
    width: ${props => props.isInnerNav ? '175' : '60'}px;
    height: 100vh;
    box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.isInnerNav ? 'start' : 'space-between'};
    align-items: ${props => props.isInnerNav ? 'start' : 'center'};
    gap:  ${props => props.isInnerNav ?  '5' : '40'}px;
`;

export const NavItem = ({ route, icon, name, isInnerNav }: IconItem & { isInnerNav?: boolean }) => {
    const location = useLocation()
    const isActive = location.pathname === route;
    return (
        <Tooltip isDisabled={isInnerNav} hasArrow key={name} placement='right' label={startCase(name)} padding={'10px'} borderRadius={4}>
            <NavLink prefetch='intent' to={`${route}`}>
                {icon && <Icon height={8} width={8} as={icon} />}
                {isInnerNav && <Text as={'p'} padding={'2px 0px 2px 20px'} fontSize='xl' fontWeight={isActive ? 700 : 400}>{startCase(name)}</Text>}
            </NavLink>
        </Tooltip>
    );
}