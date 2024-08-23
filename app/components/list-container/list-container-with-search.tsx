import { Input } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const ListContainer = styled.div<{ isWithSearch?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: ${props => props?.isWithSearch ? 'calc(100% - 50px)' : '100%'};
`

export type ListContainerWithSearchProps = {
    children: React.ReactNode;
    searchTerm: string | null;
    onChange: (val: string) => void;
}

export const ListContainerWithSearch = ({ searchTerm, onChange, children }: ListContainerWithSearchProps) => {

    return(
        <ListContainer isWithSearch style={{ padding: 20 }}>
            <Input style={{ height: 40, minHeight: 40, borderRadius: 4 }} placeholder='Type to search...' value={searchTerm || ''} onChange={e => onChange(e.target.value)} />
            {children}
        </ListContainer>
    )
}