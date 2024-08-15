import { Spinner } from '@chakra-ui/react';
import { ReactNode, forwardRef, useMemo, useRef } from 'react';
import useDebounce from 'react-use/lib/useDebounce';
import useIntersection from 'react-use/lib/useIntersection';
import { Container, Content, LoaderContainer } from './infinite-scroll.components';
import cn from 'classnames';

export type InfiniteScrollProps = {
  /**
   * @description Children to render.
   */
  children: ReactNode;

  classes?: {
    container?: string;
    content?: string;
    loadMoreElement?: string;
  };

  contentClassName?: string;

  /**
   * @description items length
   */
  dataLength?: number;

  gap?: number;
  /**
   * @description has more pages
   */
  hasMore: boolean;

  isContainerScrollEnabled?: boolean;

  isHorizontal?: boolean;

  /**
   * @description loader component
   * @default <Loading />
   */
  loader?: JSX.Element;

  /**
   * @description will be called when `loading` is visible and `hasMore === true`
   */
  onLoadMore?(): Promise<unknown> | unknown;

  /**
   * @description infinite scroll container classNames
   */
  style?: any;
  /**
   * @description nextToken for when you are grabbing unique values and the useDebounce doesn't trigger properly
   */
  token?: string;
};

export const InfiniteScroll = forwardRef<HTMLDivElement, InfiniteScrollProps>(
  (
    {
      children,
      hasMore,
      style,
      onLoadMore,
      loader,
      classes = {},
      contentClassName,
      dataLength,
      token,
      gap = 0,
      isHorizontal = false,
    },
    ref
  ) => {
    const promise = useRef<() => Promise<void>>();

    const loadingContainerRef = useRef<HTMLDivElement>(null);

    const entry = useIntersection(loadingContainerRef, { threshold: 0.3 });
    const scrollReachedBottom = entry?.isIntersecting;

    useDebounce(
      () => {
        if (promise.current) return;

        if (hasMore && scrollReachedBottom) {
          promise.current = async () => {
            await onLoadMore?.();
            promise.current = undefined;
          };

          promise.current?.();
        }
      },
      500,
      [hasMore, scrollReachedBottom, dataLength, token]
    );

    const loadingItem = useMemo(
      () => (
        <LoaderContainer hasMore={hasMore} gap={gap} isHorizontal={isHorizontal} ref={loadingContainerRef} className={classes.loadMoreElement}>
          {loader || <Spinner size='md' />}
        </LoaderContainer>
      ),
      [classes.loadMoreElement, loader]
    );

    return (
      <Container
        isHorizontal={isHorizontal}
        className={classes.container}
        style={style}
      >
        <Content isHorizontal={isHorizontal} gap={gap} ref={ref} className={cn(classes.content, contentClassName)}>
          {children}
        </Content>
        {hasMore && loadingItem}
      </Container>
    );
  }
);
