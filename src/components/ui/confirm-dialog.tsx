"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { LoadingButton } from "./loading";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "确认",
  cancelText = "取消",
  variant = "default",
  icon,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("操作失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultIcon =
    variant === "destructive" ? (
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
    ) : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center sm:text-left">
          {(icon || defaultIcon) && (
            <div className="flex justify-center sm:justify-start mb-4">
              {icon || defaultIcon}
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            isLoading={isLoading}
            className={
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                : "w-full sm:w-auto"
            }
          >
            {confirmText}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 预设的删除确认对话框
export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemName,
  itemType = "项目",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  itemName: string;
  itemType?: string;
}) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={`删除${itemType}`}
      description={`确定要删除"${itemName}"吗？此操作无法撤销。`}
      confirmText="删除"
      cancelText="取消"
      variant="destructive"
      icon={
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="h-6 w-6 text-red-600" />
        </div>
      }
    />
  );
}
