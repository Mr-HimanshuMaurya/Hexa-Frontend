import { useState } from 'react';
import { Trash2, Power } from 'lucide-react';
import toast from 'react-hot-toast';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import {
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
} from '../api/apiKeys';

export default function ApiKeysPage() {
  const { data: keys, isLoading } = useApiKeys();
  const createKey = useCreateApiKey();
  const updateKey = useUpdateApiKey();
  const deleteKey = useDeleteApiKey();

  const [label, setLabel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [dailyLimit, setDailyLimit] = useState(300);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!label.trim() || !apiKey.trim()) {
      toast.error('Label and API key required');
      return;
    }
    try {
      await createKey.mutateAsync({ label, apiKey, dailyLimit: Number(dailyLimit) || 300 });
      toast.success('API key added');
      setLabel('');
      setApiKey('');
      setDailyLimit(300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add key');
    }
  };

  const handleToggle = async (key) => {
    try {
      await updateKey.mutateAsync({ id: key._id, isActive: !key.isActive });
      toast.success(key.isActive ? 'Key deactivated' : 'Key activated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this API key?')) return;
    try {
      await deleteKey.mutateAsync(id);
      toast.success('Key deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <Topbar title="api-keys" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="font-mono text-lg uppercase tracking-widest text-neon-green">
            Brevo API Keys
          </h1>
          <p className="mt-1 font-mono text-xs text-gray-500">
            Keys rotate automatically when daily quota (default 300) is reached.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="glow-card mb-8 grid gap-4 rounded-lg p-5 md:grid-cols-4"
        >
          <Input label="Label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Key 1" />
          <Input
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="xkeysib-..."
            className="md:col-span-1"
          />
          <Input
            label="Daily Limit"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            min={1}
          />
          <div className="flex items-end">
            <Button type="submit" variant="solid" loading={createKey.isPending} className="w-full">
              Add Key
            </Button>
          </div>
        </form>

        {isLoading && <Spinner text="Loading keys" />}

        <div className="grid gap-4 md:grid-cols-2">
          {keys?.map((key) => {
            const pct = key.dailyLimit ? Math.round((key.usedToday / key.dailyLimit) * 100) : 0;
            return (
              <div key={key._id} className="glow-card rounded-lg p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="font-mono text-sm text-neon-green">{key.label}</div>
                    <div className="mt-1 font-mono text-xs text-gray-500">{key.apiKeyMasked}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(key)}
                      className={`rounded border p-1.5 ${
                        key.isActive
                          ? 'border-neon-green/40 text-neon-green'
                          : 'border-gray-600 text-gray-500'
                      }`}
                      title="Toggle active"
                    >
                      <Power size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(key._id)}
                      className="rounded border border-neon-red/30 p-1.5 text-neon-red/70 hover:text-neon-red"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-1 flex justify-between font-mono text-[10px] text-gray-400">
                  <span>
                    {key.usedToday} / {key.dailyLimit} used
                  </span>
                  <span>{key.remaining} left</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-terminal-bg">
                  <div
                    className={`h-full transition-all ${
                      pct >= 90 ? 'bg-neon-red' : pct >= 70 ? 'bg-yellow-400' : 'bg-neon-green'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <div className="mt-2 font-mono text-[10px] text-gray-600">
                  {key.isActive ? 'ACTIVE' : 'INACTIVE'}
                </div>
              </div>
            );
          })}
        </div>

        {keys?.length === 0 && !isLoading && (
          <p className="font-mono text-sm text-gray-500">No API keys configured yet.</p>
        )}
      </main>
    </>
  );
}
