import { useTokenInfo } from 'hooks/useTokenInfo'
import { useChainInfo } from 'hooks/useChainInfo'
import { useQuery } from 'react-query'
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { getUnstakingDuration } from 'services/staking'
import { WalletStatusType } from 'state/atoms/walletAtoms'

export const useUnstakingDuration = ({ poolId }) => {
  const token = useTokenInfo(poolId)
  const [chainInfo] = useChainInfo()

  const { data = 0, isLoading } = useQuery(
    `unstakingDuration/${poolId}`,
    async () => {
      const client = await CosmWasmClient.connect(chainInfo.rpc)
      return getUnstakingDuration(token?.staking_address, client)
    },
    {
      enabled: Boolean(
        token?.staking_address && status === WalletStatusType.connected
      ),
      refetchOnMount: false,
      refetchIntervalInBackground: false,
    }
  )

  return [data, isLoading] as const
}
