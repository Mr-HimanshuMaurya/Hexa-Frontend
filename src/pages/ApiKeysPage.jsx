import { useState } from 'react';
import { Trash2, Power, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import {
  useApiKeys,
  useCreateApiKey,
  useUpdateApiKey,
  useDeleteApiKey,
} from '../api/apiKeys';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ApiKeysPage() {
  const { data: keys, isLoading } = useApiKeys();
  const createKey = useCreateApiKey();
  const updateKey = useUpdateApiKey();
  const deleteKey = useDeleteApiKey();

  const [label, setLabel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [dailyLimit, setDailyLimit] = useState(300);

  const [editOpen, setEditOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [editSenderEmail, setEditSenderEmail] = useState('');
  const [editSenderName, setEditSenderName] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!label.trim() || !apiKey.trim()) {
      toast.error('Label and API key required');
      return;
    }
    if (!senderEmail.trim()) {
      toast.error('Sender email is required');
      return;
    }
    if (!EMAIL_REGEX.test(senderEmail.trim())) {
      toast.error('Enter a valid sender email');
      return;
    }
    try {
      await createKey.mutateAsync({
        label,
        apiKey,
        senderEmail: senderEmail.trim(),
        senderName: senderName.trim() || undefined,
        dailyLimit: Number(dailyLimit) || 300,
      });
      toast.success('API key added');
      setLabel('');
      setApiKey('');
      setSenderEmail('');
      setSenderName('');
      setDailyLimit(300);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add key');
    }
  };

  const openEdit = (key) => {
    setEditingKey(key);
    setEditSenderEmail(key.senderEmail || '');
    setEditSenderName(key.senderName || '');
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editSenderEmail.trim()) {
      toast.error('Sender email is required');
      return;
    }
    if (!EMAIL_REGEX.test(editSenderEmail.trim())) {
      toast.error('Enter a valid sender email');
      return;
    }
    try {
      await updateKey.mutateAsync({
        id: editingKey._id,
        senderEmail: editSenderEmail.trim(),
        senderName: editSenderName.trim() || undefined,
        isActive: true,
      });
      toast.success('Sender email updated');
      setEditOpen(false);
      setEditingKey(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleToggle = async (key) => {
    if (!key.isComplete && !key.isActive) {
      openEdit(key);
      toast.error('Add a verified sender email before activating this key');
      return;
    }
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
      <main className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h1 className="font-mono text-base uppercase tracking-widest text-neon-green sm:text-lg">
            Brevo API Keys
          </h1>
          <p className="mt-1 font-mono text-[10px] text-gray-500 sm:text-xs">
            Each key uses its own verified sender email when sending.
          </p>
        </div>

        <form
          onSubmit={handleAdd}
          className="glow-card mb-6 grid gap-3 rounded-lg p-4 sm:mb-8 sm:gap-4 sm:p-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <Input label="Label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Key 1" />
          <Input
            label="API Key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="xkeysib-..."
          />
          <Input
            label="Sender Email"
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="verified@yourdomain.com"
            required
          />
          <Input
            label="Sender Name (optional)"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Hexa Mailer"
          />
          <Input
            label="Daily Limit"
            type="number"
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            min={1}
          />
          <div className="flex items-end md:col-span-2 lg:col-span-1">
            <Button type="submit" variant="solid" loading={createKey.isPending} className="w-full">
              Add Key
            </Button>
          </div>
          <p className="font-mono text-[10px] text-yellow-400/90 md:col-span-2 lg:col-span-3">
            Sender email must be verified in your Brevo account for this API key — otherwise sending will fail.
          </p>
        </form>

        {isLoading && <Spinner text="Loading keys" />}

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {keys?.map((key) => {
            const pct = key.dailyLimit ? Math.round((key.usedToday / key.dailyLimit) * 100) : 0;
            return (
              <div key={key._id} className="glow-card rounded-lg p-4 sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-sm text-neon-green">{key.label}</div>
                    <div className="mt-1 truncate font-mono text-[11px] text-neon-cyan/80 sm:text-xs">
                      {key.isComplete ? key.senderEmail : 'No sender email configured'}
                    </div>
                    {key.senderName && key.isComplete && (
                      <div className="mt-0.5 truncate font-mono text-[10px] text-gray-500">
                        From: {key.senderName}
                      </div>
                    )}
                    <div className="mt-1 truncate font-mono text-[11px] text-gray-500 sm:text-xs">
                      {key.apiKeyMasked}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {!key.isComplete && (
                      <button
                        onClick={() => openEdit(key)}
                        className="rounded border border-yellow-400/40 p-1.5 text-yellow-400"
                        title="Add sender email"
                      >
                        <Pencil size={14} />
                      </button>
                    )}
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

                {!key.isComplete && (
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge color="yellow">Incomplete — add sender email</Badge>
                    <button
                      type="button"
                      onClick={() => openEdit(key)}
                      className="font-mono text-[10px] text-neon-cyan underline"
                    >
                      Edit now
                    </button>
                  </div>
                )}

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

      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingKey(null);
        }}
        title="Add Sender Email"
      >
        <div className="space-y-4">
          <p className="font-mono text-xs text-gray-400">
            Key: <span className="text-neon-green">{editingKey?.label}</span>
          </p>
          <Input
            label="Sender Email"
            type="email"
            value={editSenderEmail}
            onChange={(e) => setEditSenderEmail(e.target.value)}
            placeholder="verified@yourdomain.com"
            required
          />
          <Input
            label="Sender Name (optional)"
            value={editSenderName}
            onChange={(e) => setEditSenderName(e.target.value)}
            placeholder="Hexa Mailer"
          />
          <p className="font-mono text-[10px] text-yellow-400/90">
            This must be a verified sender email in your Brevo account, otherwise sending will fail.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" loading={updateKey.isPending} onClick={handleSaveEdit}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
