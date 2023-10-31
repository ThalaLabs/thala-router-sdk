import axios from "axios";
import { Coin, RawPool, PoolData } from "./types";

class PoolDataClient {
  private poolData: PoolData | null = null;
  private lastUpdated: number = 0;
  private expiry = 10000; // 10 seconds
  private retryLimit = 3;
  private URL = "";

  constructor(dataURL: string) {
    this.URL = dataURL;
  }

  async getPoolData(): Promise<PoolData> {
    const currentTime = Date.now();
    if (!this.poolData || currentTime - this.lastUpdated > this.expiry) {
      for (let i = 0; i < this.retryLimit; i++) {
        try {
          const response = await axios.get(this.URL);

          // Convert the indices in the pools to the actual coin addresses
          const coins = response.data.coins as Coin[];
          const pools = response.data.pools.map((pool: RawPool) => {
            return {
              ...pool,
              balance0: pool.balance0 / Math.pow(10, coins[pool.asset0].decimals),
              balance1: pool.balance1 / Math.pow(10, coins[pool.asset1].decimals),
              balance2: pool.balance2 ? pool.balance2 / Math.pow(10, coins[pool.asset2 as number].decimals) : undefined,
              balance3: pool.balance3 ? pool.balance3 / Math.pow(10, coins[pool.asset3 as number].decimals) : undefined,
              asset0: coins[pool.asset0],
              asset1: coins[pool.asset1],
              asset2: pool.asset2 ? coins[pool.asset2] : undefined,
              asset3: pool.asset3 ? coins[pool.asset3] : undefined,
            };
          });

          this.poolData = {
            pools,
            coins,
          };
          this.lastUpdated = currentTime;
          return this.poolData;
        } catch (error) {
          console.error("Failed to get pool data:", error);
          if (i < this.retryLimit - 1) {
            console.log("Retrying...");
          } else {
            console.log("Failed after retrying.");
            throw error;
          }
        }
      }
    }
    return this.poolData!;
  }
}

export { PoolDataClient };
