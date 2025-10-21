---
title: 组件库DSL设计理念
slug: programming-dsl-comprehensive-guide
published: true
featured: true
category: 前端
publishedAt: 2025-5-31T00:00:00.000Z
readingTime: 8
tags:
  - ts
  - react
---

## 1. DSL设计理念

这个组件库采用了**流式接口(Fluent Interface)**的DSL设计，核心思想是让字段配置写起来像自然语言一样流畅：

```typescript
// DSL示例
F("姓名", "name").Text().Required().Placeholder("请输入姓名").val;
F("年龄", "age").Number().Required().Align("right").W(100).val;
F("状态", "status").Select({ data: options }).Required().Hidden().val;
```

## 2. 链式调用的实现机制

### 1.2.1. 基础设计模式 - 建造者模式

所有字段创建器都继承自 `FieldCreator` 基类：

```typescript
export class FieldCreator<FieldProps = AnyObject, WrapperProps = AnyObject> {
  private _val: FieldConfigType<FieldProps, WrapperProps>;

  constructor(
    title: string | React.ReactElement,

    dataIndex: string,
    titleText?: string
  ) {
    this._val = {
      title,
      _titleText: titleText ?? (typeof title === "string" ? title : ""),
      dataIndex,
      key: dataIndex,
      valueType: "text",
      renderer: {},
      fieldProps: {} as FieldProps,
      formItemProps: {},
    };
  }

  // 链式调用的核心：每个方法都返回 this
  VT(type: ValueType) {
    this._setVal("valueType", type);
    return this; // ←← 关键！返回自身实现链式调用
  }

  MFP<ValueType extends ValueTypePresets = "text">(
    type: ValueType,
    props?: ExtractGetter<
      ValueType,
      FieldConfigType<ProFieldsProps[ValueType]>["fieldProps"]
    >
  ) {
    this.VT(type);
    if (!props) return this;
    return this._setPipeGetter("fieldProps", props as PipeGetter<FieldProps>);
  }

  get val() {
    return this._val; // 最终获取配置对象
  }
}
```

### 1.2.2. 继承扩展 - 不同场景的字段创建器

```typescript
// 表单字段创建器 - 支持编辑功能
export class EditableFieldCreator extends FieldCreator {
  Required(msg?: string) {
    const message = msg ?? genRequiredMsg(this.val as FieldConfigType);
    return this._mergeVal({ control: { required: true } }).MFIP({
      required: true,
      rules: [{ required: true, message }],
    });
  }

  Text(opts?: ProTextProps) {
    return this.MFP("text", opts); // 调用父类方法，保持链式
  }

  Number(opts?: ProNumberProps) {
    this.Align("right"); // 数字默认右对齐
    return this.MFP("number", opts);
  }
}

// 导出不同场景的创建器函数
export const F = (...params) => new EditableFieldCreator(...params); // 表单
export const T = (...params) => new FieldCreator(...params); // 表格
export const D = (...params) => new FieldCreator(...params); // 描述
export const ET = (...params) => new EditableFieldCreator(...params); // 可编辑表格
```

### 1.2.3. 方法分类 - 不同职责的链式方法

```typescript
export class FieldCreator {
  // 📝 字段类型设置
  VT(type: ValueType) {
    /* ... */ return this;
  }
  Text(opts?) {
    return this.MFP("text", opts);
  }
  Number(opts?) {
    return this.MFP("number", opts);
  }

  // 🎛️ 字段属性设置 (MFP = Merge Field Props)
  MFP(type, props) {
    /* 设置字段组件props */ return this;
  }

  // 📋 表单项属性设置 (MFIP = Merge Form Item Props)
  MFIP(props) {
    /* 设置表单项props */ return this;
  }

  // 🎨 包装器属性设置 (MWP = Merge Wrapper Props)
  MWP(props) {
    /* 设置外层包装组件props */ return this;
  }

  // 🔧 控制选项设置
  Control(control) {
    /* 设置字段控制选项 */ return this;
  }
  Hidden(hidden = true) {
    return this._mergeVal({ control: { hidden } });
  }
  Disabled(disabled = true) {
    return this._mergeVal({ control: { disabled } });
  }

  // 📐 布局相关
  W(width) {
    /* 设置宽度 */ return this;
  }
  Align(align) {
    /* 设置对齐方式 */ return this;
  }

  // 🔗 依赖关系
  DependencyFields(deps, depFn) {
    /* 字段依赖 */ return this;
  }
  DependencyValue(deps, depFn) {
    /* 值依赖 */ return this;
  }
}
```

## 3. DSL到配置项的转换机制

### 1.3.1. PipeGetter机制 - 统一的配置管道

核心是 `PipeGetter<T>` 类型，支持静态配置和动态函数：

```typescript
export type PipeGetter<T, Extra = AnyObject> =
  | T // 静态配置对象
  | (PipeFn<T, Extra> & {
      // 动态配置函数
      _payload?: Partial<T & AnyObject>; // 保存之前的配置状态
    });

// 配置解析函数
export function getPipeGetterValue<T extends AnyObject, Extra = AnyObject>(
  dft: T, // 默认配置
  getter?: PipeGetter<T, Extra>, // 用户配置
  extra?: Extra // 上下文信息
) {
  if (!getter) return dft;
  if (typeof getter === "object") return mergeProps(dft, getter);
  else return getter(mergeProps(dft, getter._payload as T), extra);
}
```

### 1.3.2. 配置累积机制 - \_setPipeGetter

```typescript

protected _setPipeGetter<Field extends 'fieldProps' | 'formItemProps'>(

  field: Field,
  getter?: Getter
) {
  if (!getter) return this

  // 对象式配置：直接合并
  if (typeof getter === 'object') {
    this._mergeVal({ [field]: getter })
  }
  // 函数式配置：保存之前的状态到 _payload
  else if (typeof getter === 'function') {
    set(getter, '_payload', this._val[field])  // 🔑 关键：累积之前的配置
    this._setVal(field, getter as AnyType)
  }

  return this
}
```

### 1.3.3. 最终配置对象结构

经过DSL链式调用后，最终生成标准的 `FieldConfigType` 配置：

```typescript
export type FieldConfigType<FieldProps = AnyObject, WrapperProps = AnyObject> = {

  title: string | React.ReactElement      // 字段标题

  _titleText?: string                     // 纯文本标题(用于生成占位符等)
  dataIndex: string                       // 数据字段名
  key: string                            // 唯一标识

  valueType: ValueType                   // 字段类型：'text' | 'number' | 'select' 等

  renderer: FieldRendererType            // 自定义渲染器
  fieldProps: PipeGetter<FieldProps>     // 字段组件属性(支持函数)
  wrapperProps?: WrapperProps            // 包装器属性
  formItemProps?: PipeGetter<FormItemProps>  // 表单项属性(支持函数)

  control?: FieldControlType             // 控制选项：hidden、disabled、required等
  dependency?: { ... }                   // 依赖配置
  extra?: { ... }                       // 其他扩展配置
}
```

## 4. 配置到渲染的转换过程

### 1.4.1. 表单渲染器的使用

```typescript
// 表单中的配置解析
export function FormItemElWrapper(props: { field: FieldConfigType }) {
  const { field } = props;

  // 🔄 解析字段属性 - 支持函数动态计算
  const fieldProps = getFieldProps(
    { placeholder: getDftPlaceholder(field) }, // 默认配置
    { field, formBinding } // 上下文
  );

  // 🔄 解析表单项属性
  const formItemProps = getFormItemProps(
    { required: field.control?.required }, // 默认配置
    { field } // 上下文
  );

  // 🎯 根据字段类型获取对应的字段渲染器
  const FieldClass = matchFieldClass({ field, fieldMap });
  const fieldRenderer = new FieldClass();

  // 🎨 调用对应的切面渲染方法
  return fieldRenderer.renderFormItem(null, {
    field,
    formBinding,
    // ... 其他上下文
  });
}
```

### 1.4.2. 表格渲染器的使用

```typescript
// 表格中的配置解析
export function TableColumnMapper(props: { fields: FieldConfigType[] }) {
  return props.fields.map((field) => ({
    title: field.title,
    dataKey: field.dataIndex,
    render(text, rowItem, rowIndex, dataKey) {
      // 🎯 获取字段渲染器
      const FieldClass = matchFieldClass({ field, fieldMap });
      const fieldRenderer = new FieldClass();

      // 🎨 调用表格切面渲染方法
      return fieldRenderer.renderCell(text, {
        field,
        rowData: rowItem,
        rowIndex,
        dataKey,
      });
    },
  }));
}
```

### 1.4.3. 描述列表渲染器的使用

```typescript
// 描述列表中的配置解析
export function DescriptionsRender(props: { fields: FieldConfigType[] }) {
  return props.fields.map((field) => {
    const FieldClass = matchFieldClass({ field, fieldMap })
    const fieldRenderer = new FieldClass()

    const dataItem = dataSource[field.dataIndex]

    return (
      <Descriptions.Item key={field.key} label={field.title}>
        {/* 🎨 调用只读切面渲染方法 */}
        {fieldRenderer.render(dataItem, { field, rowData: dataSource })}
      </Descriptions.Item>
    )
  })
}
```

## 5. DSL设计的核心优势

1. **类型安全**: TypeScript 提供完整的类型推导和检查
2. **配置复用**: 同一份配置可以在不同渲染器间复用
3. **渐进式增强**: 可以从简单配置开始，逐步添加复杂功能
4. **上下文感知**: 配置函数可以访问表单值、依赖字段等上下文
5. **切面隔离**: 不同使用场景的渲染逻辑完全独立

通过这种DSL设计，开发者可以用极其简洁的代码描述复杂的字段配置，同时保持高度的灵活性和类型安全性。

```typescript
// DSL示例
F("姓名", "name").Text().Required().Placeholder("请输入姓名").val;
F("年龄", "age").Number().Required().Align("right").W(100).val;
F("状态", "status").Select({ data: options }).Required().Hidden().val;
```

```typescript
export class FieldCreator<FieldProps = AnyObject, WrapperProps = AnyObject> {
  private _val: FieldConfigType<FieldProps, WrapperProps>;

  constructor(
    title: string | React.ReactElement,

    dataIndex: string,
    titleText?: string
  ) {
    this._val = {
      title,
      _titleText: titleText ?? (typeof title === "string" ? title : ""),
      dataIndex,
      key: dataIndex,
      valueType: "text",
      renderer: {},
      fieldProps: {} as FieldProps,
      formItemProps: {},
    };
  }

  // 链式调用的核心：每个方法都返回 this
  VT(type: ValueType) {
    this._setVal("valueType", type);
    return this; // ←← 关键！返回自身实现链式调用
  }

  MFP<ValueType extends ValueTypePresets = "text">(
    type: ValueType,
    props?: ExtractGetter<
      ValueType,
      FieldConfigType<ProFieldsProps[ValueType]>["fieldProps"]
    >
  ) {
    this.VT(type);
    if (!props) return this;
    return this._setPipeGetter("fieldProps", props as PipeGetter<FieldProps>);
  }

  get val() {
    return this._val; // 最终获取配置对象
  }
}
```

```typescript
// 表单字段创建器 - 支持编辑功能
export class EditableFieldCreator extends FieldCreator {
  Required(msg?: string) {
    const message = msg ?? genRequiredMsg(this.val as FieldConfigType);
    return this._mergeVal({ control: { required: true } }).MFIP({
      required: true,
      rules: [{ required: true, message }],
    });
  }

  Text(opts?: ProTextProps) {
    return this.MFP("text", opts); // 调用父类方法，保持链式
  }

  Number(opts?: ProNumberProps) {
    this.Align("right"); // 数字默认右对齐
    return this.MFP("number", opts);
  }
}

// 导出不同场景的创建器函数
export const F = (...params) => new EditableFieldCreator(...params); // 表单
export const T = (...params) => new FieldCreator(...params); // 表格
export const D = (...params) => new FieldCreator(...params); // 描述
export const ET = (...params) => new EditableFieldCreator(...params); // 可编辑表格
```

```typescript
export class FieldCreator {
  // 📝 字段类型设置
  VT(type: ValueType) {
    /* ... */ return this;
  }
  Text(opts?) {
    return this.MFP("text", opts);
  }
  Number(opts?) {
    return this.MFP("number", opts);
  }

  // 🎛️ 字段属性设置 (MFP = Merge Field Props)
  MFP(type, props) {
    /* 设置字段组件props */ return this;
  }

  // 📋 表单项属性设置 (MFIP = Merge Form Item Props)
  MFIP(props) {
    /* 设置表单项props */ return this;
  }

  // 🎨 包装器属性设置 (MWP = Merge Wrapper Props)
  MWP(props) {
    /* 设置外层包装组件props */ return this;
  }

  // 🔧 控制选项设置
  Control(control) {
    /* 设置字段控制选项 */ return this;
  }
  Hidden(hidden = true) {
    return this._mergeVal({ control: { hidden } });
  }
  Disabled(disabled = true) {
    return this._mergeVal({ control: { disabled } });
  }

  // 📐 布局相关
  W(width) {
    /* 设置宽度 */ return this;
  }
  Align(align) {
    /* 设置对齐方式 */ return this;
  }

  // 🔗 依赖关系
  DependencyFields(deps, depFn) {
    /* 字段依赖 */ return this;
  }
  DependencyValue(deps, depFn) {
    /* 值依赖 */ return this;
  }
}
```

```typescript
export type PipeGetter<T, Extra = AnyObject> =
  | T // 静态配置对象
  | (PipeFn<T, Extra> & {
      // 动态配置函数
      _payload?: Partial<T & AnyObject>; // 保存之前的配置状态
    });

// 配置解析函数
export function getPipeGetterValue<T extends AnyObject, Extra = AnyObject>(
  dft: T, // 默认配置
  getter?: PipeGetter<T, Extra>, // 用户配置
  extra?: Extra // 上下文信息
) {
  if (!getter) return dft;
  if (typeof getter === "object") return mergeProps(dft, getter);
  else return getter(mergeProps(dft, getter._payload as T), extra);
}
```

```typescript

protected _setPipeGetter<Field extends 'fieldProps' | 'formItemProps'>(

  field: Field,
  getter?: Getter
) {
  if (!getter) return this

  // 对象式配置：直接合并
  if (typeof getter === 'object') {
    this._mergeVal({ [field]: getter })
  }
  // 函数式配置：保存之前的状态到 _payload
  else if (typeof getter === 'function') {
    set(getter, '_payload', this._val[field])  // 🔑 关键：累积之前的配置
    this._setVal(field, getter as AnyType)
  }

  return this
}
```

```typescript
export type FieldConfigType<FieldProps = AnyObject, WrapperProps = AnyObject> = {

  title: string | React.ReactElement      // 字段标题

  _titleText?: string                     // 纯文本标题(用于生成占位符等)
  dataIndex: string                       // 数据字段名
  key: string                            // 唯一标识

  valueType: ValueType                   // 字段类型：'text' | 'number' | 'select' 等

  renderer: FieldRendererType            // 自定义渲染器
  fieldProps: PipeGetter<FieldProps>     // 字段组件属性(支持函数)
  wrapperProps?: WrapperProps            // 包装器属性
  formItemProps?: PipeGetter<FormItemProps>  // 表单项属性(支持函数)

  control?: FieldControlType             // 控制选项：hidden、disabled、required等
  dependency?: { ... }                   // 依赖配置
  extra?: { ... }                       // 其他扩展配置
}
```

```typescript
// 表单中的配置解析
export function FormItemElWrapper(props: { field: FieldConfigType }) {
  const { field } = props;

  // 🔄 解析字段属性 - 支持函数动态计算
  const fieldProps = getFieldProps(
    { placeholder: getDftPlaceholder(field) }, // 默认配置
    { field, formBinding } // 上下文
  );

  // 🔄 解析表单项属性
  const formItemProps = getFormItemProps(
    { required: field.control?.required }, // 默认配置
    { field } // 上下文
  );

  // 🎯 根据字段类型获取对应的字段渲染器
  const FieldClass = matchFieldClass({ field, fieldMap });
  const fieldRenderer = new FieldClass();

  // 🎨 调用对应的切面渲染方法
  return fieldRenderer.renderFormItem(null, {
    field,
    formBinding,
    // ... 其他上下文
  });
}
```

```typescript
// 表格中的配置解析
export function TableColumnMapper(props: { fields: FieldConfigType[] }) {
  return props.fields.map((field) => ({
    title: field.title,
    dataKey: field.dataIndex,
    render(text, rowItem, rowIndex, dataKey) {
      // 🎯 获取字段渲染器
      const FieldClass = matchFieldClass({ field, fieldMap });
      const fieldRenderer = new FieldClass();

      // 🎨 调用表格切面渲染方法
      return fieldRenderer.renderCell(text, {
        field,
        rowData: rowItem,
        rowIndex,
        dataKey,
      });
    },
  }));
}
```

```typescript
// 描述列表中的配置解析
export function DescriptionsRender(props: { fields: FieldConfigType[] }) {
  return props.fields.map((field) => {
    const FieldClass = matchFieldClass({ field, fieldMap })
    const fieldRenderer = new FieldClass()

    const dataItem = dataSource[field.dataIndex]

    return (
      <Descriptions.Item key={field.key} label={field.title}>
        {/* 🎨 调用只读切面渲染方法 */}
        {fieldRenderer.render(dataItem, { field, rowData: dataSource })}
      </Descriptions.Item>
    )
  })
}
```
