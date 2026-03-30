import { useEffect, useState } from 'react';
import { PIPELINE_BATCH_SIZE, PIPELINE_JOBS } from '../data';

export type PipelinePhase = 'appearing' | 'checking' | 'sliding' | 'done';

const TOTAL_BATCHES = PIPELINE_JOBS.length / PIPELINE_BATCH_SIZE;

interface PipelineAnimationState {
  batch: number;
  visible: number;
  checked: number;
  phase: PipelinePhase;
  paused: boolean;
  reduced: boolean;
}

interface PipelineAnimationActions {
  setPaused: (paused: boolean) => void;
  restart: () => void;
}

export interface UsePipelineAnimationResult
  extends PipelineAnimationState,
    PipelineAnimationActions {}

export function usePipelineAnimation(): UsePipelineAnimationResult {
  const [batch, setBatch] = useState(0);
  const [visible, setVisible] = useState(0);
  const [checked, setChecked] = useState(0);
  const [phase, setPhase] = useState<PipelinePhase>('appearing');
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Animation state machine
  useEffect(() => {
    if (paused || reduced || phase === 'done') return;

    let ms: number;
    let fn: () => void;

    if (phase === 'appearing' && visible < PIPELINE_BATCH_SIZE) {
      ms = 200;
      fn = () => setVisible((v) => v + 1);
    } else if (phase === 'appearing') {
      ms = 300;
      fn = () => setPhase('checking');
    } else if (phase === 'checking' && checked < PIPELINE_BATCH_SIZE) {
      ms = 300;
      fn = () => setChecked((c) => c + 1);
    } else if (phase === 'checking') {
      ms = 500;
      fn = () => setPhase('sliding');
    } else if (phase === 'sliding') {
      ms = 600;
      fn =
        batch < TOTAL_BATCHES - 1
          ? () => {
              setBatch((b) => b + 1);
              setVisible(0);
              setChecked(0);
              setPhase('appearing');
            }
          : () => setPhase('done');
    } else {
      return;
    }

    const id = setTimeout(fn, ms);
    return () => clearTimeout(id);
  }, [phase, visible, checked, batch, paused, reduced]);

  const restart = () => {
    setBatch(0);
    setVisible(0);
    setChecked(0);
    setPhase('appearing');
    setPaused(false);
  };

  return {
    batch,
    visible,
    checked,
    phase,
    paused,
    reduced,
    setPaused,
    restart,
  };
}
