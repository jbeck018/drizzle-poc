import { Skeleton } from "@chakra-ui/react";
import { ListContainer } from "../list-container";

export const CardSkeletonList = ({ count }: { count: number }) => {
    return (
        <ListContainer>
            {[...Array.from(Array(count).keys())].map(i => <Skeleton borderRadius={4} height={'100px'} width={'100%'} key={i} />)}
        </ListContainer>
    )
}