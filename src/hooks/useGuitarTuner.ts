import { useState, useEffect, useRef, useCallback } from 'react';

interface TunerState {
  frequency: number | null;
  isListening: boolean;
  error: string | null;
  volumeLevel: number;
  isTooQuiet: boolean;
}

const VOLUME_THRESHOLD = 0.01;

export const useGuitarTuner = () => {
  const [state, setState] = useState<TunerState>({
    frequency: null,
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
        const freq = fundamentalHz(buf, ctx.sampleRate);
        
        setState(prev => ({ ...prev, frequency: freq, isListening: true }));
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
  }, [fundamentalHz]);

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
    
    setState(prev => ({ 
      ...prev, 
      isListening: false, 
      frequency: null, 
      volumeLevel: 0,
      isTooQuiet: false 
    }));
  }, []);

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