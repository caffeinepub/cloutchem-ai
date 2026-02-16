import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCamera } from '../camera/useCamera';
import { useVideoRecorder } from '../hooks/useVideoRecorder';
import { useHasSecurityQuestions } from '../hooks/useSecurityQuestions';
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
  Save,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import SaveCaptureDialog from '../components/captures/SaveCaptureDialog';
import { generateCaptions } from '../utils/captionGenerator';
import { toast } from 'sonner';

export default function CameraPage() {
  const navigate = useNavigate();
  const { data: hasQuestions, isLoading: checkingQuestions } = useHasSecurityQuestions();

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
    recordedBlob,
    error: recordingError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  } = useVideoRecorder();

  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [capturedPhotoFile, setCapturedPhotoFile] = useState<File | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [mediaToSave, setMediaToSave] = useState<{
    file: File | null;
    type: 'photo' | 'video';
    previewUrl: string | null;
    caption: string;
  } | null>(null);

  // Redirect to security questions setup if not completed
  useEffect(() => {
    if (!checkingQuestions && hasQuestions === false) {
      navigate({ to: '/security-questions-setup' });
    }
  }, [hasQuestions, checkingQuestions, navigate]);

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
      setCapturedPhotoFile(photoFile);
    }
  };

  const handleClearPhoto = () => {
    if (capturedPhoto) {
      URL.revokeObjectURL(capturedPhoto);
      setCapturedPhoto(null);
      setCapturedPhotoFile(null);
    }
  };

  const handleSavePhoto = () => {
    if (!capturedPhotoFile || !capturedPhoto) return;

    const captions = generateCaptions({
      topic: 'captured moment',
      tone: 'casual',
      platform: 'instagram',
    });

    const caption = captions.length > 0 ? captions[0].text : 'Check out this amazing capture!';

    setMediaToSave({
      file: capturedPhotoFile,
      type: 'photo',
      previewUrl: capturedPhoto,
      caption,
    });
    setSaveDialogOpen(true);
  };

  const handleSaveVideo = () => {
    if (!recordedBlob || !recordedUrl) return;

    const videoFile = new File([recordedBlob], `video-${Date.now()}.webm`, {
      type: recordedBlob.type,
    });

    const captions = generateCaptions({
      topic: 'video recording',
      tone: 'casual',
      platform: 'instagram',
    });

    const caption = captions.length > 0 ? captions[0].text : 'Check out this amazing video!';

    setMediaToSave({
      file: videoFile,
      type: 'video',
      previewUrl: recordedUrl,
      caption,
    });
    setSaveDialogOpen(true);
  };

  const handleSaveSuccess = () => {
    toast.success('Capture saved successfully!');
    if (mediaToSave?.type === 'photo') {
      handleClearPhoto();
    } else {
      handleClearRecording();
    }
    setMediaToSave(null);
  };

  const handleSwitchCamera = async () => {
    await switchCamera();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading while checking security questions
  if (checkingQuestions) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      </div>
    );
  }

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
              {/* Video Preview or Playback */}
              <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
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
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {isRecording && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 font-semibold">
                        <Circle className="w-3 h-3 fill-current animate-pulse" />
                        REC {formatDuration(recordingDuration)}
                      </div>
                    )}
                  </>
                ) : (
                  <video src={recordedUrl} controls className="w-full h-full object-cover" style={{ minHeight: '400px' }} />
                )}
              </div>

              {/* Camera Controls */}
              {!recordedUrl && (
                <div className="flex flex-wrap gap-3">
                  {!isCameraActive ? (
                    <Button
                      onClick={startCamera}
                      disabled={isCameraLoading}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold gap-2"
                    >
                      {isCameraLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
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
                            disabled={!isCameraActive}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold gap-2"
                          >
                            <Circle className="w-4 h-4" />
                            Start Recording
                          </Button>
                          <Button
                            onClick={handleTakePhoto}
                            disabled={!isCameraActive}
                            variant="outline"
                            className="gap-2 border-accent/30 hover:bg-accent/10"
                          >
                            <CameraIcon className="w-4 h-4" />
                            Take Photo
                          </Button>
                          <Button
                            onClick={handleSwitchCamera}
                            disabled={!isCameraActive || isCameraLoading}
                            variant="outline"
                            className="gap-2 border-accent/30 hover:bg-accent/10"
                          >
                            <SwitchCamera className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={stopCamera}
                            disabled={!isCameraActive}
                            variant="outline"
                            className="gap-2 border-accent/30 hover:bg-accent/10"
                          >
                            <Square className="w-4 h-4" />
                            Stop Camera
                          </Button>
                        </>
                      ) : (
                        <>
                          {!isPaused ? (
                            <Button
                              onClick={pauseRecording}
                              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-background font-semibold gap-2"
                            >
                              <Pause className="w-4 h-4" />
                              Pause Recording
                            </Button>
                          ) : (
                            <Button
                              onClick={resumeRecording}
                              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold gap-2"
                            >
                              <Play className="w-4 h-4" />
                              Resume Recording
                            </Button>
                          )}
                          <Button
                            onClick={handleStopRecording}
                            variant="destructive"
                            className="gap-2"
                          >
                            <Square className="w-4 h-4" />
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
                <div className="flex gap-3">
                  <Button
                    onClick={handleSaveVideo}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to My Captures
                  </Button>
                  <Button
                    onClick={handleClearRecording}
                    variant="outline"
                    className="gap-2 border-accent/30 hover:bg-accent/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
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
                <div className="flex gap-3">
                  <Button
                    onClick={handleSavePhoto}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save to My Captures
                  </Button>
                  <Button
                    onClick={handleClearPhoto}
                    variant="outline"
                    className="gap-2 border-accent/30 hover:bg-accent/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Save Capture Dialog */}
      {mediaToSave && (
        <SaveCaptureDialog
          open={saveDialogOpen}
          onOpenChange={setSaveDialogOpen}
          mediaFile={mediaToSave.file}
          mediaType={mediaToSave.type}
          previewUrl={mediaToSave.previewUrl}
          initialCaption={mediaToSave.caption}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}
