"use client";

import React from "react";
import type { Queue } from "../../core/queue";
import type { AudioEngineActions } from "../store/types";
import type { EffectsState, VisualizationState } from "./types";

const ActionsContext = React.createContext<AudioEngineActions | null>(null);

const QueueContext = React.createContext<Queue | null>(null);

const EffectsContext = React.createContext<EffectsState | null>(null);

const VisualizationContext = React.createContext<VisualizationState | null>(
  null
);

export { ActionsContext, QueueContext, EffectsContext, VisualizationContext };
