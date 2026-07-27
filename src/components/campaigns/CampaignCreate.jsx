import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useTemplates } from '../../api/templates';
import { useContacts } from '../../api/contacts';
import { useCreateCampaign } from '../../api/campaigns';
import { useUIStore } from '../../store/useUIStore';

export default function CampaignCreate({ open, onClose }) {
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [contactPage, setContactPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  const { data: templatesData } = useTemplates(1, '');
  const { data: contactsData } = useContacts(contactPage, search, tag);
  const createCampaign = useCreateCampaign();
  const navigate = useNavigate();

  const selectedIds = useUIStore((s) => s.selectedContactIds);
  const toggleContactId = useUIStore((s) => s.toggleContactId);
  const selectAllContacts = useUIStore((s) => s.selectAllContacts);
  const clearSelectedContacts = useUIStore((s) => s.clearSelectedContacts);

  const contacts = contactsData?.data || [];
  const templates = templatesData?.data || [];
  const selectedTemplate = templates.find((t) => t._id === templateId);

  const handleLaunch = async () => {
    if (!name.trim()) {
      toast.error('Campaign name required');
      return;
    }
    if (!templateId) {
      toast.error('Select a template');
      return;
    }
    if (selectedIds.length === 0) {
      toast.error('Select at least one contact');
      return;
    }

    try {
      const campaign = await createCampaign.mutateAsync({
        name,
        templateId,
        contactIds: selectedIds,
      });
      toast.success('Campaign launched');
      clearSelectedContacts();
      onClose();
      navigate(`/campaigns/${campaign._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Launch failed');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New Campaign" wide>
      <div className="space-y-5">
        <Input
          label="Campaign Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="March outreach"
        />

        <div>
          <label className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-neon-cyan/80">
            Template
          </label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full rounded border border-neon-green/20 bg-terminal-bg px-3 py-2.5 font-mono text-sm text-gray-100 outline-none focus:border-neon-green/60"
          >
            <option value="">Select template...</option>
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} — {t.subject}
              </option>
            ))}
          </select>
          {selectedTemplate && (
            <div className="mt-2 h-28 overflow-hidden rounded border border-neon-cyan/20 bg-white p-2 text-[8px] text-gray-800">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedTemplate.htmlContent?.slice(0, 800),
                }}
              />
            </div>
          )}
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <Input
                label="Filter contacts"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setContactPage(1);
                }}
                placeholder="Search..."
              />
            </div>
            <div className="w-40">
              <Input
                label="Tag"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value);
                  setContactPage(1);
                }}
                placeholder="leads"
              />
            </div>
          </div>

          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center gap-2 font-mono text-xs text-gray-400">
              <input
                type="checkbox"
                checked={
                  contacts.length > 0 && contacts.every((c) => selectedIds.includes(c._id))
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    selectAllContacts([
                      ...new Set([...selectedIds, ...contacts.map((c) => c._id)]),
                    ]);
                  } else {
                    const pageIds = new Set(contacts.map((c) => c._id));
                    selectAllContacts(selectedIds.filter((id) => !pageIds.has(id)));
                  }
                }}
                className="accent-neon-green"
              />
              Select page
            </label>
            <span className="font-mono text-[10px] text-neon-cyan">
              {selectedIds.length} selected
            </span>
          </div>

          <ul className="max-h-48 divide-y divide-neon-green/10 overflow-y-auto rounded border border-neon-green/15">
            {contacts.map((c) => (
              <li key={c._id} className="flex items-center gap-2 px-3 py-2 hover:bg-neon-green/5">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c._id)}
                  onChange={() => toggleContactId(c._id)}
                  className="accent-neon-green"
                />
                <span className="font-mono text-xs text-gray-300">{c.email}</span>
                {c.name && <span className="text-xs text-gray-500">({c.name})</span>}
              </li>
            ))}
            {contacts.length === 0 && (
              <li className="px-3 py-4 font-mono text-xs text-gray-500">No contacts found</li>
            )}
          </ul>

          {contactsData?.pagination?.pages > 1 && (
            <div className="mt-2 flex justify-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                disabled={contactPage <= 1}
                onClick={() => setContactPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={contactPage >= contactsData.pagination.pages}
                onClick={() => setContactPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-neon-green/15 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" loading={createCampaign.isPending} onClick={handleLaunch}>
            Launch Campaign
          </Button>
        </div>
      </div>
    </Modal>
  );
}
