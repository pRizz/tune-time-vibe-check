import { useGuitarTuner } from '@/hooks/useGuitarTuner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const CHROMATIC_NOTES = [
  // Octave 2
  { note: 'C2', frequency: 65.41 },
  { note: 'C#2', frequency: 69.30 },
  { note: 'D2', frequency: 73.42 },
  { note: 'D#2', frequency: 77.78 },
  { note: 'E2', frequency: 82.41 },
  { note: 'F2', frequency: 87.31 },
  { note: 'F#2', frequency: 92.50 },
  { note: 'G2', frequency: 98.00 },
  { note: 'G#2', frequency: 103.83 },
  { note: 'A2', frequency: 110.00 },
  { note: 'A#2', frequency: 116.54 },
  { note: 'B2', frequency: 123.47 },
  
  // Octave 3
  { note: 'C3', frequency: 130.81 },
  { note: 'C#3', frequency: 138.59 },
  { note: 'D3', frequency: 146.83 },
  { note: 'D#3', frequency: 155.56 },
  { note: 'E3', frequency: 164.81 },
  { note: 'F3', frequency: 174.61 },
  { note: 'F#3', frequency: 185.00 },
  { note: 'G3', frequency: 196.00 },
  { note: 'G#3', frequency: 207.65 },
  { note: 'A3', frequency: 220.00 },
  { note: 'A#3', frequency: 233.08 },
  { note: 'B3', frequency: 246.94 },
  
  // Octave 4
  { note: 'C4', frequency: 261.63 },
  { note: 'C#4', frequency: 277.18 },
  { note: 'D4', frequency: 293.66 },
  { note: 'D#4', frequency: 311.13 },
  { note: 'E4', frequency: 329.63 },
  { note: 'F4', frequency: 349.23 },
  { note: 'F#4', frequency: 369.99 },
  { note: 'G4', frequency: 392.00 },
  { note: 'G#4', frequency: 415.30 },
  { note: 'A4', frequency: 440.00 },
  { note: 'A#4', frequency: 466.16 },
  { note: 'B4', frequency: 493.88 },
  
  // Octave 5
  { note: 'C5', frequency: 523.25 },
  { note: 'C#5', frequency: 554.37 },
  { note: 'D5', frequency: 587.33 },
  { note: 'D#5', frequency: 622.25 },
  { note: 'E5', frequency: 659.25 },
  { note: 'F5', frequency: 698.46 },
  { note: 'F#5', frequency: 739.99 },
  { note: 'G5', frequency: 783.99 },
  { note: 'G#5', frequency: 830.61 },
  { note: 'A5', frequency: 880.00 },
  { note: 'A#5', frequency: 932.33 },
  { note: 'B5', frequency: 987.77 },
];

const getClosestNote = (frequency: number) => {
  let closest = CHROMATIC_NOTES[0];
  let minDiff = Math.abs(frequency - closest.frequency);
  
  for (const note of CHROMATIC_NOTES) {
    const diff = Math.abs(frequency - note.frequency);
    if (diff < minDiff) {
      minDiff = diff;
      closest = note;
    }
  }
  
  const cents = Math.round(1200 * Math.log2(frequency / closest.frequency));
  return { ...closest, cents, diff: minDiff };
};

export const GuitarTuner = () => {
  const { frequency, isListening, error, volumeLevel, isTooQuiet, startTuner, stopTuner } = useGuitarTuner();
  
  const closestNote = frequency ? getClosestNote(frequency) : null;
  const isInTune = closestNote && Math.abs(closestNote.cents) <= 5;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Chromatic Tuner
          </h1>
          <p className="text-muted-foreground">
            Tune any instrument with precision
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              {isListening ? (
                <Mic className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <MicOff className="h-5 w-5 text-muted-foreground" />
              )}
              Microphone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={isListening ? stopTuner : startTuner}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className="w-full"
              >
                {isListening ? "Stop Listening" : "Start Tuning"}
              </Button>
            </div>

            {error && (
              <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            {isListening && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {isTooQuiet ? (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-primary" />
                  )}
                  <div className="flex-1 bg-secondary rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ${
                        isTooQuiet ? 'bg-muted-foreground' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(volumeLevel * 1000, 100)}%` }}
                    />
                  </div>
                </div>

                {isTooQuiet ? (
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      Play louder - signal too quiet
                    </p>
                  </div>
                ) : frequency ? (
                  <div className="text-center space-y-4">
                    <div className="space-y-2">
                      <div className="text-6xl font-mono font-bold text-primary">
                        {frequency.toFixed(1)}
                        <span className="text-lg text-muted-foreground ml-1">Hz</span>
                      </div>
                      
                      {closestNote && (
                        <div className="space-y-3">
                           <div className="flex items-center justify-center gap-2">
                             <Badge 
                               variant={isInTune ? "default" : "secondary"}
                               className={`text-2xl px-4 py-2 ${
                                 isInTune ? 'bg-primary text-primary-foreground' : ''
                               }`}
                             >
                               {closestNote.note}
                             </Badge>
                             <span className="text-sm text-muted-foreground">
                               {closestNote.frequency.toFixed(2)} Hz
                             </span>
                           </div>
                          
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {closestNote.cents > 0 ? '+' : ''}{closestNote.cents} cents
                            </span>
                            {isInTune && (
                              <Badge variant="outline" className="text-primary border-primary">
                                In Tune!
                              </Badge>
                            )}
                          </div>
                          
                          <div className="relative w-full h-3 bg-secondary rounded-full overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-0.5 h-full bg-primary/50" />
                            </div>
                            <div
                              className={`absolute top-0 h-full w-1 rounded-full transition-all duration-200 ${
                                isInTune ? 'bg-primary' : closestNote.cents > 0 ? 'bg-destructive' : 'bg-warning'
                              }`}
                              style={{
                                left: `${Math.max(0, Math.min(100, 50 + (closestNote.cents / 50) * 25))}%`,
                                transform: 'translateX(-50%)'
                              }}
                            />
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Flat</span>
                            <span>Sharp</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      Listening for pitch...
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/30 backdrop-blur-sm border-border/30">
          <CardHeader>
            <CardTitle className="text-lg">Common Reference Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between p-2 rounded bg-muted/50">
                <span className="font-mono font-bold">A4</span>
                <span className="text-muted-foreground">440.00 Hz</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/50">
                <span className="font-mono font-bold">C4</span>
                <span className="text-muted-foreground">261.63 Hz</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/50">
                <span className="font-mono font-bold">E2</span>
                <span className="text-muted-foreground">82.41 Hz</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-muted/50">
                <span className="font-mono font-bold">G3</span>
                <span className="text-muted-foreground">196.00 Hz</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};