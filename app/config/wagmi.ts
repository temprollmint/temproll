import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { tempoMainnet } from './chains'

export const config = createConfig({
  chains: [tempoMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [tempoMainnet.id]: http('https://rpc.tempo.xyz'),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
