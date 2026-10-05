// src/components/dynamic-form/fields/FileField.tsx
"use client";

import { useFormContext, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Upload, X, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileFieldConfig } from "../types";

export function FileField({ field }: { field: FileFieldConfig }) {
  const { control } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <Controller
      control={control}
      name={field.name}
      render={({ field: formField, fieldState }) => {
        const files: File[] = field.multiple
          ? (formField.value ?? [])
          : formField.value
            ? [formField.value]
            : [];

        const handleFiles = (fileList: FileList | null) => {
          if (!fileList) return;
          setError("");
          const newFiles = Array.from(fileList);

          if (field.maxSize) {
            const oversized = newFiles.find((f) => f.size > field.maxSize!);
            if (oversized) {
              setError(
                `حجم الملف ${oversized.name} يتجاوز الحد الأقصى (${formatSize(field.maxSize)})`,
              );
              return;
            }
          }

          if (field.multiple) {
            formField.onChange([...files, ...newFiles]);
          } else {
            formField.onChange(newFiles[0]);
          }
        };

        const removeFile = (index: number) => {
          if (field.multiple) {
            formField.onChange(files.filter((_, i) => i !== index));
          } else {
            formField.onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }
        };

        const combinedError =
          error || (fieldState.invalid && fieldState.error?.message);

        return (
          <Field data-invalid={!!combinedError} className={field.className}>
            <FieldLabel htmlFor={field.name}>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors",
                field.disabled && "opacity-50 cursor-not-allowed",
                combinedError && "border-destructive",
              )}
              onClick={() => !field.disabled && inputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!field.disabled) handleFiles(e.dataTransfer.files);
              }}
            >
              <input
                ref={inputRef}
                id={field.name}
                type="file"
                accept={field.accept}
                multiple={field.multiple}
                disabled={field.disabled}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                aria-invalid={!!combinedError}
              />
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                اسحب الملفات هنا أو انقر للاختيار
              </p>
              {field.accept && (
                <p className="text-xs text-muted-foreground mt-1">
                  الصيغ المدعومة: {field.accept}
                </p>
              )}
            </div>

            {files.length > 0 && (
              <div className="space-y-2 mt-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(file.size)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeFile(index)}
                      disabled={field.disabled}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {field.description && (
              <FieldDescription>{field.description}</FieldDescription>
            )}
            {combinedError && (
              <FieldError errors={[{ message: String(combinedError) }]} />
            )}
          </Field>
        );
      }}
    />
  );
}
