import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Topbar from '../components/layout/Topbar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import TemplateList from '../components/templates/TemplateList';
import TemplateEditor from '../components/templates/TemplateEditor';
import { useTemplates, useDeleteTemplate } from '../api/templates';
import { useUIStore } from '../store/useUIStore';

export default function TemplatesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useTemplates(page, search);
  const deleteTemplate = useDeleteTemplate();

  const editorOpen = useUIStore((s) => s.templateEditorOpen);
  const editingId = useUIStore((s) => s.editingTemplateId);
  const setEditor = useUIStore((s) => s.setTemplateEditorOpen);

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success('Template deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      <Topbar title="templates" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-mono text-lg uppercase tracking-widest text-neon-green">
              Templates
            </h1>
            <p className="mt-1 font-mono text-xs text-gray-500">
              Reusable HTML emails with {'{{name}}'} / {'{{email}}'} placeholders
            </p>
          </div>
          <Button variant="solid" onClick={() => setEditor(true, null)}>
            <Plus size={14} /> New Template
          </Button>
        </div>

        <div className="mb-6 max-w-sm">
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {isLoading && <Spinner text="Loading templates" />}

        {!isLoading && (
          <TemplateList
            templates={data?.data}
            onEdit={(tpl) => setEditor(true, tpl._id)}
            onDelete={handleDelete}
          />
        )}

        {data?.pagination?.pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
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

      <TemplateEditor
        open={editorOpen}
        templateId={editingId}
        onClose={() => setEditor(false, null)}
      />
    </>
  );
}
