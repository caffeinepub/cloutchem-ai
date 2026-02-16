import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle2, AlertCircle, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { useSaveCapture } from '../../hooks/useCaptures';
import { ExternalBlob, CaptureType } from '../../backend';
import { fileToBytes } from '../../utils/fileToBytes';

interface SaveCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaFile: File | null;
  mediaType: 'photo' | 'video';
  previewUrl: string | null;
  initialCaption: string;
  onSuccess: () => void;
}

export default function SaveCaptureDialog({
  open,
  onOpenChange,
  mediaFile,
  mediaType,
  previewUrl,
  initialCaption,
  onSuccess,
}: SaveCaptureDialogProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const saveCapture = useSaveCapture();

  useEffect(() => {
    if (open) {
      setCaption(initialCaption);
      setUploadProgress(0);
      setIsSaving(false);
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, [open, initialCaption]);

  const handleSave = async () => {
    if (!mediaFile) {
      setSaveError('No media file available');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setUploadProgress(0);

    try {
      const bytes = await fileToBytes(mediaFile);
      // Cast to Uint8Array<ArrayBuffer> to match ExternalBlob.fromBytes signature
      const typedBytes = new Uint8Array(bytes.buffer) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(typedBytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const capture = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: BigInt(Date.now() * 1000000),
        captureType: mediaType === 'photo' ? CaptureType.photo : CaptureType.video,
        blob,
        aiCaption: caption.trim() || 'No caption',
      };

      await saveCapture.mutateAsync(capture);
      setSaveSuccess(true);
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
      }, 1500);
    } catch (error: any) {
      console.error('Save capture error:', error);
      setSaveError(error.message || 'Failed to save capture');
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mediaType === 'photo' ? (
              <ImageIcon className="w-5 h-5 text-amber-400" />
            ) : (
              <VideoIcon className="w-5 h-5 text-amber-400" />
            )}
            Save {mediaType === 'photo' ? 'Photo' : 'Video'} to My Captures
          </DialogTitle>
          <DialogDescription>
            Review and edit the AI-generated caption before saving
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          {previewUrl && (
            <div className="relative w-full bg-black rounded-lg overflow-hidden">
              {mediaType === 'photo' ? (
                <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[300px] object-contain" />
              ) : (
                <video src={previewUrl} className="w-full h-auto max-h-[300px] object-contain" controls />
              )}
            </div>
          )}

          {/* Caption Editor */}
          <div className="space-y-2">
            <Label htmlFor="caption">AI-Generated Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter a caption for your capture..."
              rows={4}
              disabled={isSaving || saveSuccess}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {caption.length} characters
            </p>
          </div>

          {/* Upload Progress */}
          {isSaving && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <Alert className="bg-green-500/10 border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                Capture saved successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {saveError && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{saveError}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving || saveSuccess}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || saveSuccess || !caption.trim()}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : (
              'Save to My Captures'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
