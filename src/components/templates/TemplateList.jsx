import TemplateCard from './TemplateCard';

export default function TemplateList({ templates, onEdit, onDelete }) {
  if (!templates?.length) {
    return (
      <p className="font-mono text-sm text-gray-500">No templates yet. Create one to start.</p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((t) => (
        <TemplateCard key={t._id} template={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
