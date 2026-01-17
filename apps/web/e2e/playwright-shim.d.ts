declare module "@playwright/test" {
  export interface Page {
    goto(url: string, options?: { timeout?: number; waitUntil?: string }): Promise<Response | null>;
    waitForURL(url: string | RegExp, options?: { timeout?: number }): Promise<void>;
    getByLabel(label: string | RegExp): Locator;
    getByRole(role: string, options?: { name?: string | RegExp }): Locator;
    getByPlaceholder(placeholder: string | RegExp): Locator;
    locator(selector: string): Locator;
    context(): BrowserContext;
  }

  export interface BrowserContext {
    addCookies(cookies: Array<{
      name: string;
      value: string;
      domain: string;
      path: string;
      httpOnly: boolean;
      secure: boolean;
      sameSite: "Lax" | "Strict" | "None";
    }>): Promise<void>;
    storageState(options?: { path?: string }): Promise<void>;
  }

  export interface Locator {
    fill(value: string): Promise<void>;
    click(): Promise<void>;
  }

  export interface LocatorAssertions {
    toBeVisible(): Promise<void>;
    toBeDisabled(): Promise<void>;
    not: LocatorAssertions;
  }

  export interface PageAssertions {
    toHaveURL(url: string | RegExp): Promise<void>;
    not: PageAssertions;
  }

  export interface TestFunction {
    (name: string, fn: (args: { page: Page; context: BrowserContext }) => Promise<void>): void;
    describe: (name: string, fn: () => void) => void;
    beforeAll: (fn: () => Promise<void>) => void;
    afterAll: (fn: () => Promise<void>) => void;
    use: (config: Record<string, unknown>) => void;
  }

  export const test: TestFunction & {
    step: (name: string, fn: () => Promise<void>) => Promise<void>;
  };

  export interface ExpectFunction {
    (actual: Locator): LocatorAssertions;
    (actual: Page): PageAssertions;
  }

  export const expect: ExpectFunction;

  export interface PlaywrightTestConfig {
    testDir?: string;
    fullyParallel?: boolean;
    forbidOnly?: boolean;
    retries?: number;
    workers?: number | undefined;
    reporter?: Array<[string, Record<string, unknown>] | string>;
    use?: Record<string, unknown>;
    projects?: Array<{
      name: string;
      use?: Record<string, unknown>;
      testMatch?: RegExp;
      dependencies?: string[];
    }>;
    webServer?: {
      command: string;
      url: string;
      reuseExistingServer: boolean;
      timeout: number;
    };
  }

  export function defineConfig(config: PlaywrightTestConfig): PlaywrightTestConfig;

  export const devices: Record<string, Record<string, unknown>>;

  export interface Response {
    ok: boolean;
    status: number;
  }
}
