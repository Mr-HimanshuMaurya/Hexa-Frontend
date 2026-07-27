import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Topbar from '../components/layout/Topbar';
import Spinner from '../components/ui/Spinner';
import CampaignProgress from '../components/campaigns/CampaignProgress';
import CampaignLogs from '../components/campaigns/CampaignLogs';
import {
  useCampaignProgress,
  useResumeCampaign,
} from '../api/campaigns';

export default function CampaignDetailPage() {
  const { id } = useParams();
  const { data: progress, isLoading } = useCampaignProgress(id, true);
  const resume = useResumeCampaign();

  const handleResume = async () => {
    try {
      await resume.mutateAsync(id);
      toast.success('Campaign resumed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Resume failed');
    }
  };

  return (
    <>
      <Topbar title={`campaigns/${id?.slice(-6)}`} />
      <main className="flex-1 overflow-y-auto p-6">
        <Link
          to="/campaigns"
          className="mb-6 inline-flex items-center gap-1 font-mono text-xs text-gray-500 hover:text-neon-cyan"
        >
          <ArrowLeft size={12} /> Back to campaigns
        </Link>

        {isLoading && <Spinner text="Loading campaign" />}

        {progress && (
          <div className="space-y-6">
            <CampaignProgress
              progress={progress}
              onResume={handleResume}
              resumeLoading={resume.isPending}
            />
            <CampaignLogs campaignId={id} />
          </div>
        )}
      </main>
    </>
  );
}
