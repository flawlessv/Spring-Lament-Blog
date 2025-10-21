"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterOption {
  label: string;
  value: string;
  color?: string;
}

interface TableFilterProps {
  columnKey: string;
  columnTitle: string;
  filterType: "text" | "select" | "multiselect" | "date";
  options?: FilterOption[];
  placeholder?: string;
  currentValue?: any;
  onFilterChange: (columnKey: string, value: any) => void;
  onApply: (columnKey: string) => void;
  onReset: (columnKey: string) => void;
  onOpen: (columnKey: string) => void;
  onClose: (columnKey: string) => void;
  isOpen: boolean;
}

export function TableFilter({
  columnKey,
  columnTitle,
  filterType,
  options = [],
  placeholder,
  currentValue,
  onFilterChange,
  onApply,
  onReset,
  onOpen,
  onClose,
  isOpen,
}: TableFilterProps) {
  const [tempValue, setTempValue] = useState<any>(currentValue);

  const handleOpen = () => {
    setTempValue(currentValue);
    onOpen(columnKey);
  };

  const handleClose = () => {
    onClose(columnKey);
  };

  const handleApply = () => {
    onFilterChange(columnKey, tempValue);
    onApply(columnKey);
  };

  const handleReset = () => {
    setTempValue(null);
    onReset(columnKey);
  };

  const hasActiveFilter =
    currentValue !== null &&
    currentValue !== undefined &&
    (Array.isArray(currentValue)
      ? currentValue.length > 0
      : currentValue !== "");

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => (open ? handleOpen() : handleClose())}
    >
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`h-6 w-6 p-0 hover:bg-gray-200 ${
            hasActiveFilter ? "bg-blue-100 text-blue-600" : ""
          }`}
          onClick={handleOpen}
        >
          <Filter
            className={`h-3 w-3 ${hasActiveFilter ? "fill-current" : ""}`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-4 space-y-4">
          {/* 筛选选项 */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filterType === "text" && (
              <div className="space-y-2">
                <Input
                  placeholder={placeholder || `筛选${columnTitle}`}
                  value={tempValue || ""}
                  onChange={(e) => setTempValue(e.target.value)}
                  className="h-8"
                />
              </div>
            )}

            {filterType === "multiselect" && options.length > 0 && (
              <>
                {options.map((option) => {
                  const isSelected = tempValue?.includes(option.value) || false;
                  return (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          const currentValues = tempValue || [];
                          if (checked) {
                            setTempValue([...currentValues, option.value]);
                          } else {
                            setTempValue(
                              currentValues.filter(
                                (v: string) => v !== option.value
                              )
                            );
                          }
                        }}
                        className="rounded"
                      />
                      {option.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="text-sm">{option.label}</span>
                    </label>
                  );
                })}
              </>
            )}

            {filterType === "select" && options.length > 0 && (
              <>
                {options.map((option) => {
                  const isSelected = tempValue === option.value;
                  return (
                    <label
                      key={option.value}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setTempValue(option.value);
                          } else {
                            setTempValue(null);
                          }
                        }}
                        className="rounded"
                      />
                      {option.color && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="text-sm">{option.label}</span>
                    </label>
                  );
                })}
              </>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center justify-between pt-3 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-800"
            >
              重置
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700"
            >
              确定
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
