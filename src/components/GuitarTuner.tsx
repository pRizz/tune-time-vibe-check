import { useGuitarTuner } from '@/hooks/useGuitarTuner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

const GUITAR_NOTES = [
  { note: 'E', frequency: 82.41, string: '6th (Low E)' },
  { note: 'A', frequency: 110.00, string: '5th' },
  { note: 'D', frequency: 146.83, string: '4th' },
  { note: 'G', frequency: 196.00, string: '3rd' },
  { note: 'B', frequency: 246.94, string: '2nd' },
  { note: 'E', frequency: 329.63, string: '1st (High E)' },
];

const getClosestNote = (frequency: number) => {
  let closest = GUITAR_NOTES[0];
  let minDiff = Math.abs(frequency - closest.frequency);
  
  for (const note of GUITAR_NOTES) {
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
            Guitar Tuner
          </h1>
          <p className="text-muted-foreground">
            Tune your guitar with precision
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
                              {closestNote.string}
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
            <CardTitle className="text-lg">Standard Tuning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {GUITAR_NOTES.map((note, index) => (
                <div key={index} className="flex justify-between p-2 rounded bg-muted/50">
                  <span className="font-mono font-bold">{note.note}</span>
                  <span className="text-muted-foreground">{note.string}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};