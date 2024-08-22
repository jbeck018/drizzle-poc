import { Input } from '@chakra-ui/react';
import styled from '@emotion/styled';

export const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
`

export type ListContainerWithSearchProps = {
    children: React.ReactNode;
    searchTerm: string | null;
    onChange: (val: string) => void;
}

export const ListContainerWithSearch = ({ searchTerm, onChange, children }: ListContainerWithSearchProps) => {

    return(
        <ListContainer style={{ padding: 20 }}>
            <Input style={{ height: 40, minHeight: 40, borderRadius: 4 }} placeholder='Type to search...' value={searchTerm || ''} onChange={e => onChange(e.target.value)} />
            {children}
        </ListContainer>
    )
}