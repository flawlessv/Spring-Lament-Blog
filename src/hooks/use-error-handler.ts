/**
 * 统一的错误处理 Hook
 *
 * 提供一致的错误显示和处理方式
 */

import { useToast } from "@/hooks/use-toast";

export function useErrorHandler() {
  const { toast } = useToast();

  /**
   * 处理错误并显示 toast 提示
   * @param error - 错误对象
   * @param defaultMessage - 默认错误消息
   */
  const handleError = (
    error: unknown,
    defaultMessage: string = "操作失败，请重试"
  ) => {
    console.error(error);

    let message = defaultMessage;

    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      message = (error as { message: string }).message;
    }

    toast({
      title: "错误",
      description: message,
      variant: "destructive",
    });
  };

  /**
   * 处理成功操作并显示 toast 提示
   * @param message - 成功消息
   */
  const handleSuccess = (message: string = "操作成功") => {
    toast({
      title: "成功",
      description: message,
      variant: "default",
    });
  };

  /**
   * 异步操作包装器，自动处理错误
   * @param fn - 异步函数
   * @param options - 配置选项
   */
  const withErrorHandling = async <T>(
    fn: () => Promise<T>,
    options: {
      errorMessage?: string;
      successMessage?: string;
      onSuccess?: (result: T) => void;
      onError?: () => void;
    } = {}
  ): Promise<T | null> => {
    const { errorMessage, successMessage, onSuccess, onError } = options;

    try {
      const result = await fn();

      if (successMessage) {
        handleSuccess(successMessage);
      }

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (error) {
      handleError(error, errorMessage);
      if (onError) {
        onError();
      }
      return null;
    }
  };

  return {
    handleError,
    handleSuccess,
    withErrorHandling,
  };
}
