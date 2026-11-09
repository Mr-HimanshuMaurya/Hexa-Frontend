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
  fetchContactAllIds,
} from '../api/contacts';
import { useUIStore } from '../store/useUIStore';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectingAll, setSelectingAll] = useState(false);
  const { data, isLoading } = useContacts(page, search);
  const deleteContact = useDeleteContact();
  const bulkDelete = useBulkDeleteContacts();

  const selectedIds = useUIStore((s) => s.selectedContactIds);
  const toggleContactId = useUIStore((s) => s.toggleContactId);
  const selectMultiple = useUIStore((s) => s.selectMultiple);
  const deselectMultiple = useUIStore((s) => s.deselectMultiple);
  const setSelectedContactIds = useUIStore((s) => s.setSelectedContactIds);
  const clearSelectedContacts = useUIStore((s) => s.clearSelectedContacts);
  const addOpen = useUIStore((s) => s.addContactOpen);
  const setAddOpen = useUIStore((s) => s.setAddContactOpen);
  const bulkOpen = useUIStore((s) => s.bulkImportOpen);
  const setBulkOpen = useUIStore((s) => s.setBulkImportOpen);

  const contacts = data?.data || [];
  const totalContacts = data?.pagination?.total ?? 0;
  const pageSize = contacts.length;
  const currentPageIds = contacts.map((c) => c._id);
  const allCurrentPageSelected =
    currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));
  const allFilteredSelected =
    totalContacts > 0 && selectedIds.length >= totalContacts;

  const handleToggleAllPage = () => {
    if (allCurrentPageSelected) {
      deselectMultiple(currentPageIds);
    } else {
      selectMultiple(currentPageIds);
    }
  };

  const handleSelectAllAcrossPages = async () => {
    setSelectingAll(true);
    try {
      const result = await fetchContactAllIds(search);
      setSelectedContactIds(result.data);
      toast.success(`Selected all ${result.total} contacts`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to select all contacts');
    } finally {
      setSelectingAll(false);
    }
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

  const selectionLabel =
    totalContacts > 0
      ? `${selectedIds.length} of ${totalContacts} contact${totalContacts === 1 ? '' : 's'} selected`
      : `${selectedIds.length} selected`;

  return (
    <>
      <Topbar title="contacts" />
      <main className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div>
            <h1 className="font-mono text-base uppercase tracking-widest text-neon-green sm:text-lg">
              Contacts
            </h1>
            <p className="mt-1 font-mono text-[10px] text-gray-500 sm:text-xs">
              {totalContacts} total in database
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {selectedIds.length > 0 && (
              <Button variant="danger" size="sm" onClick={handleBulkDelete} className="w-full sm:w-auto">
                <Trash2 size={14} /> Delete ({selectedIds.length})
              </Button>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setBulkOpen(true)} className="flex-1 sm:flex-none">
                <UploadCloud size={14} />
                <span className="sm:inline">Bulk Import</span>
              </Button>
              <Button variant="solid" onClick={() => setAddOpen(true)} className="flex-1 sm:flex-none">
                <Plus size={14} />
                <span className="sm:inline">Add</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-3 w-full sm:mb-4 sm:max-w-sm">
          <Input
            placeholder="Search email or name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {selectedIds.length > 0 && (
          <p className="mb-3 font-mono text-xs text-neon-cyan">{selectionLabel}</p>
        )}

        {allCurrentPageSelected && totalContacts > pageSize && !allFilteredSelected && (
          <div className="mb-3 rounded border border-neon-cyan/20 bg-neon-cyan/5 px-3 py-2 font-mono text-xs text-gray-300">
            All {pageSize} contacts on this page are selected.{' '}
            <button
              type="button"
              onClick={handleSelectAllAcrossPages}
              disabled={selectingAll}
              className="text-neon-cyan underline hover:text-neon-green disabled:opacity-50"
            >
              {selectingAll
                ? 'Selecting...'
                : `Select all ${totalContacts} contacts across all pages`}
            </button>
          </div>
        )}

        {isLoading && <Spinner text="Loading contacts" />}

        {!isLoading && (
          <ContactsTable
            contacts={contacts}
            selectedIds={selectedIds}
            onToggle={toggleContactId}
            onToggleAllPage={handleToggleAllPage}
            onDelete={handleDelete}
          />
        )}

        {data?.pagination?.pages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6">
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
