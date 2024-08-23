import styled from '@emotion/styled';
import { colors } from '#app/theme/colors';

export const Table = styled.table`
    display: grid;
    overflow: auto;
    position: relative; 
    height: 100%;
    width: 100%;
    grid-template-rows: 50px auto;
    border-spacing: 20px;
    border-collapse: collapse;
    border: 1px solid ${colors.gray[400]};
    border-radius: 4px;
`;

export const TableHeader = styled.thead`
    display: grid;
    position: sticky;
    top: 0;
    z-index: 5;
    background-color: #fff;
    min-height: 40px;
    width: fit-content;
`;

export const TH = styled.th`
    text-align: center;
    vertical-align: middle;
    min-height: 40px;
    border-bottom: 1px solid ${colors.gray[400]};
    & > div {
        width: 100%;
    }
`;

export const TD = styled.td`
    min-height: 40px;
    vertical-align: middle;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid ${colors.gray[400]};
    &:hover {
        background-color: ${colors.gray[400]};
    }
`;

export const TR = styled.tr`
    min-height: 40px;
`;

export const TableBody = styled.tbody`
    display: grid;
    height: 100%,;
    position: relative;
`;