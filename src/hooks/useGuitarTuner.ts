import { useState, useEffect, useRef, useCallback } from 'react';

interface TunerState {
  frequency: number | null;
  lastValidFrequency: number | null;
  displayFrequency: number | null;
  isListening: boolean;
  error: string | null;
  volumeLevel: number;
  isTooQuiet: boolean;
}

const VOLUME_THRESHOLD = 0.04;

export const useGuitarTuner = () => {
  const [state, setState] = useState<TunerState>({
    frequency: null,
    lastValidFrequency: null,
    displayFrequency: null,
    isListening: false,
    error: null,
    volumeLevel: 0,
    isTooQuiet: false,
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const frequencyBufferRef = useRef<number[]>([]);

  const fundamentalHz = useCallback((
    buf: Float32Array,
    sampleRate: number,
    minFreq = 70,
    maxFreq = 1000,
  ): number | null => {
    const rmsValue = rms(buf);
    const isTooQuiet = rmsValue < VOLUME_THRESHOLD;
    
    setState(prev => ({ ...prev, volumeLevel: rmsValue, isTooQuiet }));
    
    if (isTooQuiet) return null;

    const maxLag = Math.floor(sampleRate / minFreq);
    const minLag = Math.floor(sampleRate / maxFreq);
    let bestLag = -1;
    let bestCorr = 0;

    for (let lag = minLag; lag <= maxLag; lag++) {
      let corr = 0;
      for (let i = 0; i < buf.length - lag; i++) {
        corr += buf[i] * buf[i + lag];
      }
      if (corr > bestCorr) {
        bestCorr = corr;
        bestLag = lag;
      }
    }
    return bestLag > 0 ? sampleRate / bestLag : null;
  }, []);

  const rms = useCallback((buf: Float32Array): number => {
    let sum = 0;
    for (const v of buf) sum += v * v;
    return Math.sqrt(sum / buf.length);
  }, []);

  const updateFrequencyBuffer = useCallback((newFreq: number | null): number | null => {
    if (newFreq === null) return null;
    
    const buffer = frequencyBufferRef.current;
    buffer.push(newFreq);
    
    // Keep only the last 30 readings
    if (buffer.length > 30) {
      buffer.shift();
    }
    
    // Calculate moving average
    const sum = buffer.reduce((acc, freq) => acc + freq, 0);
    return sum / buffer.length;
  }, []);

  const startTuner = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const source = ctx.createMediaStreamSource(stream);
      sourceRef.current = source;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.0;
      analyserRef.current = analyser;
      
      source.connect(analyser);
      
      const buf = new Float32Array(analyser.fftSize);
      
      const update = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getFloatTimeDomainData(buf);
        const rawFreq = fundamentalHz(buf, ctx.sampleRate);
        const smoothedFreq = updateFrequencyBuffer(rawFreq);
        
        setState(prev => ({ 
          ...prev, 
          frequency: smoothedFreq, 
          lastValidFrequency: smoothedFreq || prev.lastValidFrequency,
          isListening: true 
        }));
        animationFrameRef.current = requestAnimationFrame(update);
      };
      
      update();
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Microphone access denied or not available', 
        isListening: false 
      }));
    }
  }, [fundamentalHz, updateFrequencyBuffer]);

  const stopTuner = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    analyserRef.current = null;
    frequencyBufferRef.current = [];
    
    setState(prev => ({ 
      ...prev, 
      isListening: false, 
      frequency: null, 
      lastValidFrequency: null,
      displayFrequency: null,
      volumeLevel: 0,
      isTooQuiet: false 
    }));
  }, []);

  useEffect(() => {
    const targetFreq = state.frequency || state.lastValidFrequency;
    if (!targetFreq) return;

    // Exponential smoothing for display frequency
    const smoothingFactor = 0.3; // Lower = smoother, higher = more responsive
    
    const interval = setInterval(() => {
      setState(prev => {
        if (!targetFreq) return prev;
        
        const currentDisplay = prev.displayFrequency || targetFreq;
        const diff = targetFreq - currentDisplay;
        
        // If difference is very small, just snap to target
        if (Math.abs(diff) < 0.1) {
          return { ...prev, displayFrequency: targetFreq };
        }
        
        const newDisplay = currentDisplay + (diff * smoothingFactor);
        return { ...prev, displayFrequency: newDisplay };
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [state.frequency, state.lastValidFrequency]);

  useEffect(() => {
    return () => {
      stopTuner();
    };
  }, [stopTuner]);

  return {
    ...state,
    startTuner,
    stopTuner,
  };
};