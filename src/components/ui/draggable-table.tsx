"use client";

/**
 * 可拖拽排序表格组件
 *
 * 基于 @dnd-kit 库实现的拖拽排序功能，支持：
 * - 鼠标拖拽排序
 * - 键盘操作排序
 * - 拖拽时的视觉反馈
 * - 自动处理排序逻辑
 *
 * 使用场景：分类管理、标签管理、文章排序等需要调整顺序的场景
 */

import { ReactNode } from "react";
import {
  DndContext, // 拖拽上下文，管理整个拖拽状态
  closestCenter, // 碰撞检测算法，找到最近的拖拽目标
  KeyboardSensor, // 键盘传感器，支持键盘操作
  PointerSensor, // 鼠标/触摸传感器，支持鼠标和触摸操作
  useSensor, // 创建传感器的钩子
  useSensors, // 组合多个传感器的钩子
  DragEndEvent, // 拖拽结束事件类型
} from "@dnd-kit/core";
import {
  arrayMove, // 数组移动工具函数
  SortableContext, // 可排序上下文，管理可排序项目
  sortableKeyboardCoordinates, // 键盘排序坐标计算
  verticalListSortingStrategy, // 垂直列表排序策略
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable"; // 使元素可排序的钩子
import { CSS } from "@dnd-kit/utilities"; // CSS 工具函数
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 可拖拽项目属性接口
 */
interface DraggableItemProps {
  id: string; // 唯一标识符，用于拖拽识别
  children: ReactNode; // 要渲染的内容
  className?: string; // 自定义样式类名
}

/**
 * 可拖拽项目组件
 *
 * 这是每个可拖拽项目的基础组件，负责：
 * 1. 提供拖拽手柄（GripVertical 图标）
 * 2. 处理拖拽时的视觉反馈
 * 3. 管理拖拽状态和样式
 */
function DraggableItem({ id, children, className }: DraggableItemProps) {
  // useSortable 钩子：使当前元素可排序
  // 返回拖拽所需的所有属性和状态
  const {
    attributes, // HTML 属性，用于无障碍访问
    listeners, // 事件监听器，处理拖拽交互
    setNodeRef, // DOM 引用，绑定到拖拽元素
    transform, // 变换信息，用于拖拽时的位置计算
    transition, // 过渡动画信息
    isDragging, // 是否正在拖拽
  } = useSortable({ id });

  // 计算拖拽时的样式
  // transform: 拖拽时的位移和旋转
  // transition: 拖拽结束时的动画过渡
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef} // 绑定 DOM 引用
      style={style} // 应用拖拽样式
      className={cn(
        "relative",
        // 拖拽时的视觉反馈：半透明、放大、阴影
        isDragging && "z-50 opacity-50 scale-105 shadow-lg",
        className
      )}
    >
      <div className="flex items-center space-x-3">
        {/* 拖拽手柄：用户拖拽的入口点 */}
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded-lg flex-shrink-0"
          {...attributes} // 无障碍属性
          {...listeners} // 拖拽事件监听器
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </Button>
        {/* 实际内容区域 */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

/**
 * 可拖拽表格属性接口
 */
interface DraggableTableProps<T = any> {
  data: T[]; // 数据数组
  onReorder: (newOrder: T[]) => void; // 排序变化回调函数
  getRecordId: (record: T) => string; // 获取记录唯一ID的函数
  renderItem: (record: T) => ReactNode; // 渲染每个项目的函数
  className?: string; // 自定义样式类名
}

/**
 * 可拖拽排序表格组件
 *
 * 这是一个通用的拖拽排序组件，可以用于任何需要排序的数据列表。
 *
 * 工作原理：
 * 1. DndContext: 提供拖拽上下文，管理整个拖拽状态
 * 2. SortableContext: 管理可排序项目列表
 * 3. DraggableItem: 每个可拖拽的项目
 * 4. 传感器: 检测用户交互（鼠标、键盘、触摸）
 * 5. 碰撞检测: 确定拖拽目标
 * 6. 排序算法: 计算新的排序结果
 *
 * @param data - 要排序的数据数组
 * @param onReorder - 排序变化时的回调函数
 * @param getRecordId - 从数据项中提取唯一ID的函数
 * @param renderItem - 渲染每个数据项的函数
 * @param className - 自定义样式类名
 */
export function DraggableTable<T = any>({
  data,
  onReorder,
  getRecordId,
  renderItem,
  className,
}: DraggableTableProps<T>) {
  // 配置传感器：检测用户的拖拽操作
  // PointerSensor: 检测鼠标和触摸操作
  // KeyboardSensor: 检测键盘操作（方向键等）
  const sensors = useSensors(
    useSensor(PointerSensor), // 鼠标/触摸传感器
    useSensor(KeyboardSensor, {
      // 键盘传感器
      coordinateGetter: sortableKeyboardCoordinates, // 键盘坐标计算函数
    })
  );

  /**
   * 处理拖拽结束事件
   *
   * 当用户完成拖拽操作时，这个函数会被调用。
   * 它会计算新的排序并通知父组件。
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 只有当拖拽到不同位置时才处理
    if (active.id !== over?.id) {
      // 找到被拖拽项目在原数组中的位置
      const oldIndex = data.findIndex(
        (item) => getRecordId(item) === active.id
      );

      // 找到拖拽目标位置
      const newIndex = data.findIndex((item) => getRecordId(item) === over?.id);

      // 使用 arrayMove 重新排列数组
      // arrayMove 是 dnd-kit 提供的工具函数，用于移动数组元素
      const newOrder = arrayMove(data, oldIndex, newIndex);

      // 通知父组件排序已改变
      onReorder(newOrder);
    }
  };

  return (
    // DndContext: 拖拽上下文，管理整个拖拽状态
    <DndContext
      sensors={sensors} // 传感器配置
      collisionDetection={closestCenter} // 碰撞检测算法：找到最近的拖拽目标
      onDragEnd={handleDragEnd} // 拖拽结束处理函数
    >
      {/* SortableContext: 可排序上下文，管理可排序项目列表 */}
      <SortableContext
        items={data.map(getRecordId)} // 所有可排序项目的ID列表
        strategy={verticalListSortingStrategy} // 排序策略：垂直列表
      >
        {/* 渲染所有可拖拽项目 */}
        <div className={cn("space-y-4", className)}>
          {data.map((record) => (
            <DraggableItem
              key={getRecordId(record)} // React key
              id={getRecordId(record)} // 拖拽ID
            >
              {renderItem(record)} {/* 渲染实际内容 */}
            </DraggableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

/**
 * 使用示例：
 *
 * ```tsx
 * // 1. 基本使用
 * <DraggableTable
 *   data={categories}
 *   onReorder={(newOrder) => {
 *     // 处理排序变化
 *     setCategories(newOrder);
 *     // 保存到后端
 *     saveOrderToServer(newOrder);
 *   }}
 *   getRecordId={(category) => category.id}
 *   renderItem={(category) => (
 *     <div className="p-4 border rounded">
 *       <h3>{category.name}</h3>
 *       <p>{category.description}</p>
 *     </div>
 *   )}
 * />
 *
 * // 2. 在分类管理中使用
 * <DraggableTable
 *   data={categories}
 *   onReorder={handleDragReorder}
 *   getRecordId={(category) => category.id}
 *   renderItem={(category) => (
 *     <CategoryCard category={category} />
 *   )}
 * />
 * ```
 *
 * 关键概念解释：
 *
 * 1. **DndContext**: 拖拽的根上下文，类似于 React Context
 *    - 管理整个拖拽状态
 *    - 处理拖拽事件
 *    - 协调所有子组件
 *
 * 2. **SortableContext**: 可排序项目的容器
 *    - 管理哪些项目可以排序
 *    - 定义排序策略（垂直、水平等）
 *    - 提供排序算法
 *
 * 3. **useSortable**: 使元素可拖拽的钩子
 *    - 返回拖拽所需的属性和状态
 *    - 处理拖拽时的视觉反馈
 *    - 管理拖拽事件
 *
 * 4. **传感器 (Sensors)**: 检测用户交互
 *    - PointerSensor: 鼠标和触摸
 *    - KeyboardSensor: 键盘操作
 *    - 可以组合多个传感器
 *
 * 5. **碰撞检测**: 确定拖拽目标
 *    - closestCenter: 找到最近的拖拽目标
 *    - 其他算法: closestCorners, rectIntersection 等
 *
 * 6. **排序策略**: 定义如何排序
 *    - verticalListSortingStrategy: 垂直列表
 *    - horizontalListSortingStrategy: 水平列表
 *    - rectSortingStrategy: 矩形排序
 */
