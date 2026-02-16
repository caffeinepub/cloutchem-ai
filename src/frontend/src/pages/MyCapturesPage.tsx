import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetMyCaptures, useDeleteCapture } from '../hooks/useCaptures';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Trash2,
  Loader2,
  AlertCircle,
  Camera,
  Crown,
  Sparkles,
  Filter,
  ArrowUpDown,
} from 'lucide-react';
import { CaptureType, SubscriptionTier } from '../backend';
import DeleteCaptureConfirmDialog from '../components/captures/DeleteCaptureConfirmDialog';
import UpgradeToProCard from '../components/billing/UpgradeToProCard';
import { toast } from 'sonner';

type FilterType = 'all' | 'photo' | 'video';
type SortType = 'date-desc' | 'date-asc' | 'caption-asc' | 'caption-desc';

export default function MyCapturesPage() {
  const navigate = useNavigate();
  const { data: captures, isLoading, error } = useGetMyCaptures();
  const { data: userProfile } = useGetCallerUserProfile();
  const deleteCapture = useDeleteCapture();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('date-desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [captureToDelete, setCaptureToDelete] = useState<string | null>(null);

  const isPro = userProfile?.tier === SubscriptionTier.pro;

  // Filter and sort captures
  const filteredAndSortedCaptures = useMemo(() => {
    if (!captures) return [];

    let filtered = captures;

    // Apply filter
    if (filterType === 'photo') {
      filtered = captures.filter((c) => c.captureType === CaptureType.photo);
    } else if (filterType === 'video') {
      filtered = captures.filter((c) => c.captureType === CaptureType.video);
    }

    // Apply sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortType) {
        case 'date-desc':
          return Number(b.createdAt - a.createdAt);
        case 'date-asc':
          return Number(a.createdAt - b.createdAt);
        case 'caption-asc':
          return a.aiCaption.localeCompare(b.aiCaption);
        case 'caption-desc':
          return b.aiCaption.localeCompare(a.aiCaption);
        default:
          return 0;
      }
    });

    return sorted;
  }, [captures, filterType, sortType]);

  const handleDeleteClick = (captureId: string) => {
    setCaptureToDelete(captureId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!captureToDelete) return;

    try {
      await deleteCapture.mutateAsync(captureToDelete);
      toast.success('Capture deleted successfully');
      setDeleteDialogOpen(false);
      setCaptureToDelete(null);
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete capture');
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center">
              <Camera className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  My Captures
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                View and manage your photos and videos
              </p>
            </div>
          </div>
        </div>

        <Separator className="opacity-20" />

        {/* Pro Features Section */}
        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-600/10 backdrop-blur-sm border-amber-500/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-600/30 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <CardTitle className="text-xl">
                {isPro ? 'Pro Storage Benefits' : 'Upgrade for Unlimited Storage'}
              </CardTitle>
            </div>
            <CardDescription>
              {isPro
                ? 'You have access to all Pro storage features'
                : 'Unlock unlimited storage and advanced organization'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Unlimited Storage</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Save as many photos and videos as you want
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Advanced Organization</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Smart filters, tags, and search capabilities
                  </p>
                </div>
              </div>
            </div>

            {!isPro && (
              <div className="pt-2">
                <UpgradeToProCard tier={userProfile?.tier} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filters and Sorting */}
        <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Filter by Type</label>
                </div>
                <Select value={filterType} onValueChange={(value) => setFilterType(value as FilterType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Captures</SelectItem>
                    <SelectItem value="photo">Photos Only</SelectItem>
                    <SelectItem value="video">Videos Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <label className="text-sm font-medium">Sort By</label>
                </div>
                <Select value={sortType} onValueChange={(value) => setSortType(value as SortType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                    <SelectItem value="caption-asc">Caption (A-Z)</SelectItem>
                    <SelectItem value="caption-desc">Caption (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription>
              Failed to load captures. Please try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Empty State */}
        {!isLoading && filteredAndSortedCaptures.length === 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-accent/20">
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-600/20 flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {filterType === 'all' ? 'No captures yet' : `No ${filterType}s found`}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {filterType === 'all'
                      ? 'Start capturing photos and videos to see them here'
                      : `Try changing the filter or capture some ${filterType}s`}
                  </p>
                  <Button
                    onClick={() => navigate({ to: '/camera' })}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-background font-semibold gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Go to Camera
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Captures Grid */}
        {filteredAndSortedCaptures.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedCaptures.map((capture) => (
              <Card key={capture.id} className="bg-card/50 backdrop-blur-sm border-accent/20 overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {capture.captureType === CaptureType.photo ? (
                    <img
                      src={capture.blob.getDirectURL()}
                      alt={capture.aiCaption}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={capture.blob.getDirectURL()}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  <Badge
                    variant="secondary"
                    className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                  >
                    {capture.captureType === CaptureType.photo ? (
                      <>
                        <ImageIcon className="w-3 h-3 mr-1" />
                        Photo
                      </>
                    ) : (
                      <>
                        <VideoIcon className="w-3 h-3 mr-1" />
                        Video
                      </>
                    )}
                  </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                  <p className="text-sm line-clamp-2">{capture.aiCaption}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(capture.createdAt)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(capture.id)}
                    className="w-full gap-2 border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteCaptureConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCapture.isPending}
      />
    </div>
  );
}
