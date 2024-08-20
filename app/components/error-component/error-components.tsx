import styled from '@emotion/styled';

const ErrorContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
`;

const Description = styled.p`
    text-overflow: wrap;
`

export const ErrorComponent = ({ header, text }: { header: string, text: string }) => {
    return(
        <ErrorContainer>
            <h3>{header}</h3>
            <Description>{text}</Description>
        </ErrorContainer>
    )
}