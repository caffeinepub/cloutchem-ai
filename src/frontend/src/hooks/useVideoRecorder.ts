import { useState, useRef, useCallback } from 'react';

export interface UseVideoRecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
}

export interface UseVideoRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  recordedBlob: Blob | null;
  recordedUrl: string | null;
  error: string | null;
  startRecording: (stream: MediaStream) => void;
  stopRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  clearRecording: () => void;
}

export function useVideoRecorder(options: UseVideoRecorderOptions = {}): UseVideoRecorderReturn {
  const { mimeType = 'video/webm', videoBitsPerSecond = 2500000 } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(
    (stream: MediaStream) => {
      try {
        setError(null);
        chunksRef.current = [];

        const options: MediaRecorderOptions = {
          mimeType,
          videoBitsPerSecond,
        };

        // Check if the mimeType is supported
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          // Fallback to default
          delete options.mimeType;
        }

        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mimeType });
          setRecordedBlob(blob);
          setRecordedUrl(URL.createObjectURL(blob));
          setIsRecording(false);
          setIsPaused(false);
        };

        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setError('Recording failed. Please try again.');
          setIsRecording(false);
          setIsPaused(false);
        };

        mediaRecorder.start(100); // Collect data every 100ms
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
        setIsPaused(false);
      } catch (err) {
        console.error('Failed to start recording:', err);
        setError('Failed to start recording. Please check your permissions.');
      }
    },
    [mimeType, videoBitsPerSecond]
  );

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const clearRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setError(null);
  }, [recordedUrl]);

  return {
    isRecording,
    isPaused,
    recordedBlob,
    recordedUrl,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    clearRecording,
  };
}
