"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

type Config = {
  packageManager: "npm" | "yarn" | "pnpm" | "bun";
  installationType: "cli" | "manual";
};

type ConfigStore = Config & {
  setConfig: (config: Config) => void;
};

const defaultConfig: Config = {
  packageManager: "pnpm",
  installationType: "cli",
};

const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      ...defaultConfig,
      setConfig: (config) => set(config),
    }),
    {
      name: "config",
    }
  )
);

function useConfig(): [Config, (config: Config) => void] {
  const config = useConfigStore(
    useShallow((state) => ({
      packageManager: state.packageManager,
      installationType: state.installationType,
    }))
  );
  const setConfig = useConfigStore((state) => state.setConfig);

  return [config, setConfig];
}

export { useConfig };
