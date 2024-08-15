import styled from '@emotion/styled';

export const Container = styled.div<{ isHorizontal: boolean }>`
    display: flex;
    flex-direction: ${props => props.isHorizontal ? 'row' : 'column'};
    width: 100%;
    height: ${props => props.isHorizontal ? 'unset' : '100%'};
    overflow-x: ${props => props.isHorizontal ? 'scroll' : 'unset'};
    overflow-y: ${props => props.isHorizontal ? 'unset' : 'scroll'};
`;

export const Content = styled.div<{ isHorizontal: boolean, gap: number }>`
    width: ${props => props.isHorizontal ? 'fit-content' : '100%'};
    display: flex;
    flex-direction: ${props => props.isHorizontal ? 'row' : 'column'};
    gap: ${props => props.gap}px;
`;

export const LoaderContainer = styled.div<{ isHorizontal: boolean, hasMore: boolean, gap: number }>`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: ${props => props.isHorizontal ? [0, props.gap || 5] : [props.gap || 5, 0]};
    visibility: ${props => props.hasMore ? 'visible' : 'hidden'};
    display: ${props => props.hasMore ? 'flex' : 'none'}
`;