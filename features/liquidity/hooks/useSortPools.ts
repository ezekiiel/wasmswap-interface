import { useMemo } from 'react'
import { LiquidityInfoType } from 'hooks/usePoolLiquidity'
import { TokenInfo } from 'hooks/useTokenList'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'

export type SortParameters = 'liquidity' | 'rewards' | 'alphabetical'
export type SortDirections = 'asc' | 'desc'

type UseSortPoolsArgs = {
  liquidity?: Array<LiquidityInfoType>
  supportedTokens?: Array<TokenInfo>
  filter?: {
    tokenSymbol: string
  }
  sortBy?: {
    parameter: SortParameters
    direction: SortDirections
  }
}

type PoolInfo = {
  tokenB: TokenInfo
  tokenA: TokenInfo
  liquidityInfo: LiquidityInfoType
}

export const useSortPools = ({
  liquidity,
  supportedTokens,
  filter,
  sortBy,
}: UseSortPoolsArgs) => {
  const tokenA = useBaseTokenInfo()
  return useMemo((): readonly [Array<PoolInfo>, Array<PoolInfo>] => {
    const myPools = [] as Array<PoolInfo>
    const otherPools = [] as Array<PoolInfo>

    if (!liquidity?.length) {
      return [myPools, otherPools]
    }

    /* split up liquidity in my liquidity pools and other pools buckets */
    liquidity.forEach((liquidityInfo, index) => {
      const poolsBucket =
        liquidityInfo.myLiquidity.coins > 0 ? myPools : otherPools

      poolsBucket.push({
        tokenA,
        tokenB: supportedTokens[index],
        liquidityInfo,
      })
    })

    /* sort and filter pools */
    return [
      sortPools(filterPools(myPools, filter), sortBy),
      sortPools(filterPools(otherPools, filter), sortBy),
    ] as const
  }, [liquidity, supportedTokens, filter, sortBy, tokenA])
}

function sortPools(
  pools: Array<PoolInfo>,
  sortBy?: UseSortPoolsArgs['sortBy']
) {
  if (!sortBy) return pools
  return pools.sort((poolA, poolB) => {
    let comparisonResult = 0

    /* sort by total liquidity */
    if (sortBy.parameter === 'liquidity') {
      if (
        poolA.liquidityInfo.totalLiquidity.coins >
        poolB.liquidityInfo.totalLiquidity.coins
      ) {
        comparisonResult = 1
      } else if (
        poolA.liquidityInfo.totalLiquidity.coins <
        poolB.liquidityInfo.totalLiquidity.coins
      ) {
        comparisonResult = -1
      }
    }

    /* sort by tokenB names */
    if (sortBy.parameter === 'alphabetical') {
      if (poolA.tokenB.symbol > poolB.tokenB.symbol) {
        comparisonResult = 1
      } else if (poolA.tokenB.symbol < poolB.tokenB.symbol) {
        comparisonResult = -1
      }
    }

    return comparisonResult * (sortBy.direction === 'asc' ? 1 : -1)
  })
}

function filterPools(
  pools: Array<PoolInfo>,
  filter?: UseSortPoolsArgs['filter']
) {
  if (!filter || !filter.tokenSymbol) return pools
  return pools.filter(
    ({ tokenA, tokenB }) =>
      tokenA.symbol === filter.tokenSymbol ||
      tokenB.symbol === filter.tokenSymbol
  )
}
