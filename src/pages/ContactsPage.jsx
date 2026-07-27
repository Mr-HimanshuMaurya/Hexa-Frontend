import { useState } from 'react';
import { Plus, UploadCloud, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import ContactsTable from '../components/contacts/ContactsTable';
import AddContactModal from '../components/contacts/AddContactModal';
import BulkImportModal from '../components/contacts/BulkImportModal';
import {
  useContacts,
  useDeleteContact,
  useBulkDeleteContacts,
} from '../api/contacts';
import { useUIStore } from '../store/useUIStore';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useContacts(page, search);
  const deleteContact = useDeleteContact();
  const bulkDelete = useBulkDeleteContacts();

  const selectedIds = useUIStore((s) => s.selectedContactIds);
  const toggleContactId = useUIStore((s) => s.toggleContactId);
  const selectAllContacts = useUIStore((s) => s.selectAllContacts);
  const clearSelectedContacts = useUIStore((s) => s.clearSelectedContacts);
  const addOpen = useUIStore((s) => s.addContactOpen);
  const setAddOpen = useUIStore((s) => s.setAddContactOpen);
  const bulkOpen = useUIStore((s) => s.bulkImportOpen);
  const setBulkOpen = useUIStore((s) => s.setBulkImportOpen);

  const contacts = data?.data || [];

  const handleToggleAll = (checked) => {
    if (checked) selectAllContacts(contacts.map((c) => c._id));
    else clearSelectedContacts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await deleteContact.mutateAsync(id);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} contact(s)?`)) return;
    try {
      await bulkDelete.mutateAsync(selectedIds);
      clearSelectedContacts();
      toast.success('Contacts deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk delete failed');
    }
  };

  return (
    <>
      <Topbar title="contacts" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-mono text-lg uppercase tracking-widest text-neon-green">
              Contacts
            </h1>
            <p className="mt-1 font-mono text-xs text-gray-500">
              {data?.pagination?.total ?? 0} total in database
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIds.length > 0 && (
              <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                <Trash2 size={14} /> Delete ({selectedIds.length})
              </Button>
            )}
            <Button variant="secondary" onClick={() => setBulkOpen(true)}>
              <UploadCloud size={14} /> Bulk Import
            </Button>
            <Button variant="solid" onClick={() => setAddOpen(true)}>
              <Plus size={14} /> Add Contact
            </Button>
          </div>
        </div>

        <div className="mb-4 max-w-sm">
          <Input
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading && <Spinner text="Loading contacts" />}

        {!isLoading && (
          <ContactsTable
            contacts={contacts}
            selectedIds={selectedIds}
            onToggle={toggleContactId}
            onToggleAll={handleToggleAll}
            onDelete={handleDelete}
          />
        )}

        {data?.pagination?.pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>
            <span className="font-mono text-xs text-gray-400">
              {page} / {data.pagination.pages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= data.pagination.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      <AddContactModal open={addOpen} onClose={() => setAddOpen(false)} />
      <BulkImportModal open={bulkOpen} onClose={() => setBulkOpen(false)} />
    </>
  );
}
