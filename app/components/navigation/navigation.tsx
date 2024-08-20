import { Icon, Tooltip } from '@chakra-ui/react';
import styled from '@emotion/styled'
import { startCase } from 'lodash-es';
import { NavLink, Outlet } from "@remix-run/react";

import { IconType } from 'react-icons/lib';

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
`

const Page = styled.div`
    width: calc(100vw - 40px);
    padding: 20px;
`

const Nav = styled.nav`
    width: 60px;
    height: 100%;
    box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 40px;
    padding-top: 25px;
`

type IconItem = {
    route: string;
    icon: IconType;
    name: string;
}

export const Navigation = ({ items }: { items: IconItem[]; }) => {
    return (
        <Container>
            <Nav>
                {items.map(item => (
                    <Tooltip hasArrow key={item.name} placement='right' label={startCase(item.name)}>
                        <NavLink to={`/${item.route}`}>
                            <Icon height={8} width={8} as={item.icon} />
                        </NavLink>
                    </Tooltip>
                ))}
            </Nav>
            <Page>
                <Outlet />
            </Page>
        </Container>
    )
}