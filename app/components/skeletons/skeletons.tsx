import { Flex, Skeleton } from "@chakra-ui/react";
import { ListContainer } from "../list-container";
import React from "react";

export const CardSkeletonList = ({ count }: { count: number }) => {
    return (
        <ListContainer>
            {[...Array.from(Array(count).keys())].map(i => <Skeleton borderRadius={4} height={'100px'} width={'100%'} key={i} />)}
        </ListContainer>
    )
}

export function TableSkeleton({ count }: { count: number }) {
  return (
    <Flex direction={'column'} height={'100%'} width={'100%'} overflow={'hidden'} gap={2}>
      <Flex gap={2}>
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} borderRadius={4} height={'40px'} width={'100%'} />
        ))}
      </Flex>
      {[...Array(count)].map((_, index) => (
        <Flex key={index} gap={2}>
          {[...Array(4)].map((_, subIndex) => (
            <React.Fragment key={subIndex}>
              <Skeleton borderRadius={4} height={'50px'} width={'100%'} />
              <Skeleton borderRadius={4} height={'50px'} width={'100%'} />
            </React.Fragment>
          ))}
        </Flex>
      ))}
    </Flex>
  );
}
