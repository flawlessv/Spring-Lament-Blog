import { Star } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import type { PublishFormData } from "../types";

interface PublishSettingsProps {
  control: Control<PublishFormData>;
}

export function PublishSettings({ control }: PublishSettingsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium">
        <Star className="h-4 w-4" />
        <span>设置</span>
      </div>
      <div className="space-y-3">
        <FormField
          control={control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-sm">立即发布</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="featured"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel className="text-sm">设为精选</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
