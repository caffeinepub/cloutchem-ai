import { useEffect, useState } from 'react';
import { useCamera } from '../camera/useCamera';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Video,
  Circle,
  Square,
  Play,
  Trash2,
  Camera as CameraIcon,
  AlertCircle,
  Loader2,
  SwitchCamera,
  Pause,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function CameraPage() {
  const {
    isActive: isCameraActive,
    isSupported,
    error: cameraError,
    isLoading: isCameraLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    width: 1280,
    height: 720,
    quality: 0.92,
  });

  const {
    isRecording,
    isPaused,
    recordedUrl,
    error: recordingError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  } = useVideoRecorder();

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  // Recording duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else if (!isRecording) {
      setRecordingDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording();
      }
      stopCamera();
    };
  }, []);

  const handleStartRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      startRecording(stream);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleClearRecording = () => {
    clearRecording();
  };

  const handleTakePhoto = async () => {
    const photoFile = await capturePhoto();
    if (photoFile) {
      const photoUrl = URL.createObjectURL(photoFile);
      setCapturedPhoto(photoUrl);
    }
  };

  const handleClearPhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
      setCapturedPhoto(null);
    }
  };

  const handleSwitchCamera = async () => {
    await switchCamera();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Camera not supported
  if (isSupported === false) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base">
            Camera is not supported on this device or browser. Please try using a different device or browser with
            camera support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
              <Video className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Camera Studio
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-1">Record videos and capture photos</p>
            </div>
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* Error Messages */}
        {cameraError && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">
              {cameraError.type === 'permission'
                ? 'Camera permission denied. Please allow camera access in your browser settings.'
                : cameraError.type === 'not-found'
                  ? 'No camera found on this device.'
                  : cameraError.message}
            </AlertDescription>
          </Alert>
        )}

        {recordingError && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-base">{recordingError}</AlertDescription>
          </Alert>
        )}

        {/* Camera Preview / Playback */}
        <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-amber-400" />
              {recordedUrl ? 'Recorded Video' : 'Camera Preview'}
            </CardTitle>
            <CardDescription>
              {recordedUrl
                ? 'Review your recorded video'
                : isCameraActive
                  ? 'Camera is active and ready'
                  : 'Start the camera to begin'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Video Preview/Playback Container */}
              <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {!recordedUrl ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ minHeight: '400px' }}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    {!isCameraActive && !isCameraLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="text-center space-y-4">
                          <CameraIcon className="w-16 h-16 text-muted-foreground mx-auto" />
                          <p className="text-muted-foreground">Camera is not active</p>
                        </div>
                      </div>
                    )}
                    {isRecording && (
                      <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-full">
                        <Circle className="w-3 h-3 fill-current animate-pulse" />
                        <span className="font-mono text-sm">{formatDuration(recordingDuration)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <video src={recordedUrl} controls className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
                )}
              </div>

              {/* Camera Controls */}
              {!recordedUrl && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {!isCameraActive ? (
                    <Button
                      onClick={startCamera}
                      disabled={isCameraLoading}
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                    >
                      {isCameraLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Starting Camera...
                        </>
                      ) : (
                        <>
                          <Video className="w-5 h-5" />
                          Start Camera
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      {!isRecording ? (
                        <>
                          <Button
                            onClick={handleStartRecording}
                            disabled={isCameraLoading}
                            size="lg"
                            className="gap-2 bg-red-600 hover:bg-red-700"
                          >
                            <Circle className="w-5 h-5 fill-current" />
                            Start Recording
                          </Button>
                          <Button
                            onClick={handleTakePhoto}
                            disabled={isCameraLoading}
                            size="lg"
                            variant="outline"
                            className="gap-2"
                          >
                            <CameraIcon className="w-5 h-5" />
                            Take Photo
                          </Button>
                          <Button
                            onClick={handleSwitchCamera}
                            disabled={isCameraLoading}
                            size="lg"
                            variant="outline"
                            className="gap-2"
                          >
                            <SwitchCamera className="w-5 h-5" />
                            Switch
                          </Button>
                          <Button onClick={stopCamera} disabled={isCameraLoading} size="lg" variant="outline" className="gap-2">
                            <Square className="w-5 h-5" />
                            Stop Camera
                          </Button>
                        </>
                      ) : (
                        <>
                          {!isPaused ? (
                            <Button onClick={pauseRecording} size="lg" variant="outline" className="gap-2">
                              <Pause className="w-5 h-5" />
                              Pause
                            </Button>
                          ) : (
                            <Button
                              onClick={resumeRecording}
                              size="lg"
                              className="gap-2 bg-red-600 hover:bg-red-700"
                            >
                              <Play className="w-5 h-5" />
                              Resume
                            </Button>
                          )}
                          <Button
                            onClick={handleStopRecording}
                            size="lg"
                            className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                          >
                            <Square className="w-5 h-5" />
                            Stop Recording
                          </Button>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Playback Controls */}
              {recordedUrl && (
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    onClick={handleClearRecording}
                    size="lg"
                    variant="outline"
                    className="gap-2 border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Recording
                  </Button>
                  <Button
                    onClick={() => {
                      handleClearRecording();
                      startCamera();
                    }}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                  >
                    <Video className="w-5 h-5" />
                    Record New Video
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Captured Photo */}
        {capturedPhoto && (
          <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CameraIcon className="w-5 h-5 text-amber-400" />
                Captured Photo
              </CardTitle>
              <CardDescription>Your latest photo capture</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative w-full bg-black rounded-lg overflow-hidden">
                  <img src={capturedPhoto} alt="Captured" className="w-full h-auto" />
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={handleClearPhoto}
                    variant="outline"
                    className="gap-2 border-destructive/30 hover:bg-destructive/10"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
