import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreateTemplate, useUpdateTemplate, useTemplate } from '../../api/templates';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:24px;">
  <div style="max-width:560px; margin:0 auto; background:#fff; padding:32px; border-radius:8px;">
    <h1 style="color:#111;">Hello {{name}}</h1>
    <p>This email was sent to <strong>{{email}}</strong>.</p>
    <p><a href="https://example.com" style="color:#00a86b;">Click here</a> to learn more.</p>
  </div>
</body>
</html>`;

export default function TemplateEditor({ open, onClose, templateId }) {
  const { data: existing } = useTemplate(templateId);
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [htmlContent, setHtmlContent] = useState(DEFAULT_HTML);
  const [mode, setMode] = useState('raw'); // raw | visual

  useEffect(() => {
    if (!open) return;
    if (existing && templateId) {
      setName(existing.name || '');
      setSubject(existing.subject || '');
      setLogoUrl(existing.logoUrl || '');
      setHtmlContent(existing.htmlContent || DEFAULT_HTML);
    } else if (!templateId) {
      setName('');
      setSubject('');
      setLogoUrl('');
      setHtmlContent(DEFAULT_HTML);
    }
  }, [open, existing, templateId]);

  const insertPlaceholder = (token) => {
    setHtmlContent((prev) => prev + token);
  };

  const handleSave = async () => {
    if (!name.trim() || !subject.trim() || !htmlContent.trim()) {
      toast.error('Name, subject and HTML are required');
      return;
    }

    let finalHtml = htmlContent;
    if (logoUrl.trim() && !htmlContent.includes(logoUrl)) {
      // Soft hint: logo URL field is stored; user can embed manually
    }

    const payload = { name, subject, htmlContent: finalHtml, logoUrl };

    try {
      if (templateId) {
        await updateTemplate.mutateAsync({ id: templateId, ...payload });
        toast.success('Template updated');
      } else {
        await createTemplate.mutateAsync(payload);
        toast.success('Template created');
      }
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const loading = createTemplate.isPending || updateTemplate.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={templateId ? 'Edit Template' : 'New Template'}
      wide
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Welcome email" />
          <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Hello {{name}}" />
        </div>
        <Input
          label="Logo URL (optional)"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://..."
        />

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-gray-500">Insert:</span>
          <Button size="sm" variant="ghost" onClick={() => insertPlaceholder('{{name}}')}>
            {'{{name}}'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => insertPlaceholder('{{email}}')}>
            {'{{email}}'}
          </Button>
          {logoUrl && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                insertPlaceholder(
                  `<img src="${logoUrl}" alt="logo" style="max-height:48px;" />`
                )
              }
            >
              Insert Logo
            </Button>
          )}
          <div className="ml-auto flex gap-1">
            <Button
              size="sm"
              variant={mode === 'raw' ? 'solid' : 'ghost'}
              onClick={() => setMode('raw')}
            >
              Raw HTML
            </Button>
            <Button
              size="sm"
              variant={mode === 'visual' ? 'solid' : 'ghost'}
              onClick={() => setMode('visual')}
            >
              Visual
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded border border-neon-green/20">
            {mode === 'raw' ? (
              <Editor
                height="320px"
                defaultLanguage="html"
                theme="vs-dark"
                value={htmlContent}
                onChange={(v) => setHtmlContent(v || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  fontFamily: 'JetBrains Mono',
                  wordWrap: 'on',
                }}
              />
            ) : (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                className="h-[320px] w-full resize-none bg-terminal-bg p-3 font-sans text-sm text-gray-200 outline-none"
                placeholder="Edit HTML content..."
              />
            )}
          </div>

          <div className="overflow-hidden rounded border border-neon-cyan/20 bg-white">
            <div className="border-b border-gray-200 bg-gray-100 px-3 py-1.5 font-mono text-[10px] uppercase text-gray-500">
              Live Preview
            </div>
            <iframe
              title="preview"
              sandbox=""
              srcDoc={htmlContent}
              className="h-[292px] w-full border-0"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" loading={loading} onClick={handleSave}>
            Save Template
          </Button>
        </div>
      </div>
    </Modal>
  );
}
