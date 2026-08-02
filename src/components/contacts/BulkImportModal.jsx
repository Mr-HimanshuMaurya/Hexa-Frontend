import { useState } from "react";
import {
  FileSpreadsheet,
  ClipboardPaste,
  ImageIcon,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ImportPreviewList from "./ImportPreviewList";
import {
  useExtractPaste,
  useUploadExcel,
  useUploadCsv,
  useUploadScreenshot,
  useBulkCreateContacts,
} from "../../api/contacts";

const TABS = [
  { id: "excel", label: "Excel", icon: FileSpreadsheet },
  { id: "csv", label: "CSV", icon: UploadCloud },
  { id: "paste", label: "Paste", icon: ClipboardPaste },
  { id: "screenshot", label: "Screenshot", icon: ImageIcon },
];

export default function BulkImportModal({ open, onClose }) {
  const [tab, setTab] = useState("excel");
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState([]);
  const [tags, setTags] = useState("");
  const [parsing, setParsing] = useState(false);

  const extractPaste = useExtractPaste();
  const uploadExcel = useUploadExcel();
  const uploadCsv = useUploadCsv();
  const uploadScreenshot = useUploadScreenshot();
  const bulkCreate = useBulkCreateContacts();

  const resetPreview = () => {
    setPreview(null);
    setSelected([]);
  };

  const applyPreview = (data) => {
    setPreview(data);
    const selectable = data.found
      .filter((f) => !f.alreadyExists)
      .map((f) => f.email);
    setSelected(selectable);
  };

  const handleFile = async (file, type) => {
    if (!file) return;
    setParsing(true);
    resetPreview();
    try {
      let data;
      if (type === "excel") data = await uploadExcel.mutateAsync(file);
      else if (type === "csv") data = await uploadCsv.mutateAsync(file);
      else data = await uploadScreenshot.mutateAsync(file);
      applyPreview(data);
      toast.success(`Found ${data.count} email(s)`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Parse failed");
    } finally {
      setParsing(false);
    }
  };

  const handlePasteExtract = async () => {
    if (!pasteText.trim()) {
      toast.error("Paste some text first");
      return;
    }
    setParsing(true);
    resetPreview();
    try {
      const data = await extractPaste.mutateAsync(pasteText);
      applyPreview(data);
      toast.success(`Found ${data.count} email(s)`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Extract failed");
    } finally {
      setParsing(false);
    }
  };

  const toggle = (email) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email],
    );
  };

  const toggleAll = (checked) => {
    if (!preview) return;
    setSelected(checked ? preview.found.map((f) => f.email) : []);
  };

  const handleImport = async () => {
    if (selected.length === 0) {
      toast.error("Select at least one email");
      return;
    }
    const sourceMap = {
      excel: "excel",
      csv: "csv",
      paste: "paste",
      screenshot: "screenshot",
    };
    try {
      const result = await bulkCreate.mutateAsync({
        emails: selected,
        source: sourceMap[tab],
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });
      toast.success(`Imported ${result.inserted}, skipped ${result.skipped}`);
      resetPreview();
      setPasteText("");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Bulk Import Contacts" wide>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setTab(id);
              resetPreview();
            }}
            className={`flex items-center justify-center gap-1.5 rounded border px-2 py-2 font-mono text-[10px] uppercase tracking-wider transition sm:px-3 sm:py-1.5 sm:text-xs ${
              tab === id
                ? "border-neon-green/50 bg-neon-green/10 text-neon-green"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon size={12} className="sm:size-14" />
            {label}
          </button>
        ))}
      </div>

      {tab === "paste" && (
        <div className="space-y-3">
          <Input
            as="textarea"
            label="Paste raw text"
            rows={6}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste emails, names, or any text containing emails..."
            className="resize-y"
          />
          <Button
            variant="secondary"
            loading={parsing}
            onClick={handlePasteExtract}
            className="w-full sm:w-auto"
          >
            Extract Emails
          </Button>
        </div>
      )}

      {(tab === "excel" || tab === "csv" || tab === "screenshot") && (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded border border-dashed border-neon-green/30 bg-terminal-bg/50 px-4 py-8 text-center transition hover:border-neon-green/60 sm:px-6 sm:py-10">
          <UploadCloud className="text-neon-green" size={24} />
          <span className="font-mono text-[11px] text-gray-400 sm:text-xs">
            {parsing
              ? "Parsing contacts..."
              : tab === "screenshot"
                ? "Drop screenshot / image (OCR)"
                : `Drop ${tab.toUpperCase()} file or click to browse`}
          </span>
          <input
            type="file"
            className="hidden"
            accept={
              tab === "excel"
                ? ".xlsx,.xls"
                : tab === "csv"
                  ? ".csv,text/csv"
                  : "image/*"
            }
            onChange={(e) => handleFile(e.target.files?.[0], tab)}
          />
        </label>
      )}

      {parsing && (
        <p className="mt-3 font-mono text-xs text-neon-cyan">
          Parsing contacts<span className="cursor-blink">_</span>
        </p>
      )}

      {preview && (
        <>
          <ImportPreviewList
            items={preview.found}
            selected={selected}
            onToggle={toggle}
            onToggleAll={toggleAll}
          />
          <div className="mt-4">
            <Input
              label="Tags for import (optional)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="imported, leads"
            />
          </div>
          <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              loading={bulkCreate.isPending}
              onClick={handleImport}
              className="w-full sm:w-auto"
            >
              Import Selected ({selected.length})
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
