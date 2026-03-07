import { MODEL_TIERS, type ModelConfig } from "./models";

interface TokenState {
  token: string;
  errorCount: number;
  lastUsed: number;
  cooldownUntil: number;
}

const COOLDOWN_MS = 60_000;
const MAX_ERRORS_BEFORE_COOLDOWN = 3;

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";

class TokenPool {
  private tokens: TokenState[] = [];
  private roundRobinIndex = 0;

  constructor() {
    const envTokens = [
      process.env.HF_TOKEN_1,
      process.env.HF_TOKEN_2,
      process.env.HF_TOKEN_3,
      process.env.HF_TOKEN_4,
      process.env.HF_TOKEN_5,
    ].filter((t): t is string => !!t && t.startsWith("hf_"));

    this.tokens = envTokens.map((token) => ({
      token,
      errorCount: 0,
      lastUsed: 0,
      cooldownUntil: 0,
    }));
  }

  private getAvailableTokens(): TokenState[] {
    const now = Date.now();
    return this.tokens.filter((t) => t.cooldownUntil < now);
  }

  private getNextToken(): TokenState | null {
    const available = this.getAvailableTokens();
    if (available.length === 0) return null;

    const idx = this.roundRobinIndex % available.length;
    this.roundRobinIndex = (this.roundRobinIndex + 1) % available.length;
    return available[idx];
  }

  markSuccess(token: string) {
    const state = this.tokens.find((t) => t.token === token);
    if (state) {
      state.errorCount = 0;
      state.lastUsed = Date.now();
    }
  }

  markError(token: string) {
    const state = this.tokens.find((t) => t.token === token);
    if (state) {
      state.errorCount++;
      state.lastUsed = Date.now();
      if (state.errorCount >= MAX_ERRORS_BEFORE_COOLDOWN) {
        state.cooldownUntil = Date.now() + COOLDOWN_MS;
        state.errorCount = 0;
      }
    }
  }

  async callWithFallback(
    prompt: string,
    systemPrompt: string,
    preferredModel?: ModelConfig
  ): Promise<{ text: string; model: string; tokenIndex: number }> {
    const models = preferredModel
      ? [preferredModel, ...MODEL_TIERS.filter((m) => m.id !== preferredModel.id)]
      : MODEL_TIERS;

    if (this.tokens.length === 0) {
      throw new Error(
        "No HuggingFace tokens configured. Set HF_TOKEN_1..HF_TOKEN_5 in .env.local"
      );
    }

    let lastError: Error | null = null;

    for (const model of models) {
      for (let attempt = 0; attempt < this.tokens.length; attempt++) {
        const tokenState = this.getNextToken();
        if (!tokenState) {
          await new Promise((r) => setTimeout(r, 5000));
          continue;
        }

        try {
          const res = await fetch(HF_CHAT_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${tokenState.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model.id,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt },
              ],
              max_tokens: model.maxNewTokens,
              temperature: 0.3,
              stream: false,
            }),
          });

          if (!res.ok) {
            const errBody = await res.text();
            const status = res.status;

            this.markError(tokenState.token);
            console.warn(
              `[TokenPool] ${model.name} returned ${status} with token #${this.tokens.indexOf(tokenState)}: ${errBody.slice(0, 150)}`
            );

            if (status === 429 || status === 503 || status === 500) {
              continue;
            }
            if (status === 404 || status === 422) {
              break;
            }
            continue;
          }

          const data = await res.json();
          const text = data.choices?.[0]?.message?.content || "";

          this.markSuccess(tokenState.token);

          const tokenIdx = this.tokens.findIndex(
            (t) => t.token === tokenState.token
          );
          return { text, model: model.name, tokenIndex: tokenIdx };
        } catch (err: unknown) {
          this.markError(tokenState.token);
          lastError = err instanceof Error ? err : new Error(String(err));

          console.error(
            `[TokenPool] Network error with ${model.name}:`,
            lastError.message
          );
        }
      }
    }

    throw lastError || new Error("All tokens and models exhausted");
  }

  getStatus() {
    const now = Date.now();
    return this.tokens.map((t, i) => ({
      index: i,
      available: t.cooldownUntil < now,
      errorCount: t.errorCount,
      cooldownRemaining: Math.max(0, t.cooldownUntil - now),
    }));
  }
}

let poolInstance: TokenPool | null = null;

export function getTokenPool(): TokenPool {
  if (!poolInstance) {
    poolInstance = new TokenPool();
  }
  return poolInstance;
}
