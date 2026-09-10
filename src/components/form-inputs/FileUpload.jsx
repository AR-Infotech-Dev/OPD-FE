import { useEffect, useId, useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import DefaultLabel from "./DefaultLabel";
import ValidationError from "./ValidationError";

const toFileArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
};

const formatFileSize = (bytes) => {
  if (!Number.isFinite(Number(bytes))) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImageFile = (file) => {
  if (String(file?.type || "").startsWith("image/")) return true;
  return /\.(png|jpe?g|webp|gif|svg)$/i.test(String(file?.name || file?.file_name || file?.url || ""));
};

function ImagePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (file instanceof File) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(file?.url || file?.preview_url || "");
    return undefined;
  }, [file]);

  return previewUrl ? (
    <img className="h-14 w-20 shrink-0 rounded border border-slate-200 bg-white object-contain p-1" src={previewUrl} alt={file?.name || "Uploaded image preview"} />
  ) : <FileText size={16} className="shrink-0 text-slate-500" />;
}

function FileUpload({ field, value, onChange, error }) {
  const inputRef = useRef(null);
  const generatedId = useId();
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputId = field.id || `${field.name}-${generatedId}`;
  const files = toFileArray(value);
  const multiple = Boolean(field.multiple);
  const maxFiles = Number(field.maxFiles || (multiple ? Infinity : 1));
  const maxSizeBytes = Number(field.maxSizeMB || 0) * 1024 * 1024;
  const isDisabled = Boolean(field.disabled || field.readOnly);

  const emitFiles = (nextFiles) => {
    const nextValue = multiple ? nextFiles : (nextFiles[0] || null);
    onChange?.({
      target: {
        name: field.name,
        value: nextValue,
        files: nextFiles,
        type: "file",
      },
    });
  };

  const validateAndSelect = (selectedFiles) => {
    const nextFiles = Array.from(selectedFiles || []);
    if (!nextFiles.length) return;

    if (nextFiles.length > maxFiles) {
      setLocalError(`You can upload up to ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`);
      return;
    }

    const oversizedFile = maxSizeBytes
      ? nextFiles.find((file) => Number(file.size || 0) > maxSizeBytes)
      : null;
    if (oversizedFile) {
      setLocalError(`${oversizedFile.name} exceeds the ${field.maxSizeMB} MB limit.`);
      return;
    }

    setLocalError("");
    emitFiles(multiple ? nextFiles : nextFiles.slice(0, 1));
  };

  const removeFile = (index) => {
    const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);
    setLocalError("");
    emitFiles(nextFiles);
    if (!nextFiles.length && inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    if (!isDisabled) validateAndSelect(event.dataTransfer.files);
  };

  return (
    <div className="relative flex min-w-0 flex-col gap-1">
      <DefaultLabel label={field.label} required={field.required} />
      <input
        ref={inputRef}
        id={inputId}
        name={field.name}
        type="file"
        className="sr-only"
        accept={field.accept}
        multiple={multiple}
        required={field.required && !files.length}
        disabled={isDisabled}
        onChange={(event) => validateAndSelect(event.target.files)}
      />

      <div
        className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded border border-dashed px-4 py-3 text-center transition-colors ${
          dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50"
        } ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-blue-400 hover:bg-blue-50/50"}`}
        onClick={() => !isDisabled && inputRef.current?.click()}
        onDragEnter={(event) => { event.preventDefault(); if (!isDisabled) setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={(event) => {
          if (!isDisabled && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-disabled={isDisabled}
      >
        <Upload size={20} className="text-blue-600" />
        <span className="text-sm font-medium text-slate-700">{field.buttonText || "Choose or drop files"}</span>
        <span className="text-xs text-slate-500">
          {field.helperText || [field.accept, field.maxSizeMB ? `Max ${field.maxSizeMB} MB` : ""].filter(Boolean).join(" | ")}
        </span>
      </div>

      {files.length ? (
        <div className="mt-1 divide-y divide-slate-200 rounded border border-slate-200 bg-white">
          {files.map((file, index) => (
            <div className="flex min-w-0 items-center gap-2 px-3 py-2" key={`${file.name || file.file_name || "file"}-${index}`}>
              {field.showPreview && isImageFile(file)
                ? <ImagePreview file={file} />
                : <FileText size={16} className="shrink-0 text-slate-500" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-700">{file.name || file.file_name || "Uploaded file"}</p>
                {file.size ? <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p> : null}
              </div>
              {!isDisabled ? (
                <button type="button" className="grid h-7 w-7 shrink-0 place-items-center rounded text-slate-500 hover:bg-red-50 hover:text-red-600" onClick={(event) => { event.stopPropagation(); removeFile(index); }} title="Remove file" aria-label={`Remove ${file.name || "file"}`}>
                  <X size={15} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {(localError || error) ? <ValidationError error={localError || error} /> : null}
    </div>
  );
}

export default FileUpload;
