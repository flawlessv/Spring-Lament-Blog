---
title: BEM命名规范详解
published: true
featured: false
readingTime: 4
category: 前端
slug: BEM
publishedAt: 2023-12-22T:00:00.000Z
tags:
  - css
coverImage: https://haowallpaper.com/link/common/file/previewFileImg/17792493819383168
---

## 1. 前言：为什么我们需要BEM？

在前端开发中，CSS命名一直是个令人头疼的问题。随着项目规模扩大，我们经常会遇到：

- 样式冲突
- 命名混乱
- 维护困难
- 团队协作障碍

BEM（Block Element Modifier）命名规范就像一剂良药，能有效解决这些问题。今天，我们就来深入探讨这个神奇的命名方法。

## 2. BEM核心概念

### 1.2.1. Block（块）

块是独立的、可复用的组件单元。它就像乐高积木中的基础块，可以单独使用。

```html
<!-- 一个按钮块 -->
<button class="btn">点击我</button>

<!-- 一个卡片块 -->
<div class="card">
  <!-- 卡片内容 -->
</div>
```

### 1.2.2. Element（元素）

元素是块的组成部分，不能独立存在。命名格式为： `block__element`

```html
<!-- 搜索框块中的输入元素和按钮元素 -->
<div class="search">
  <input class="search__input" type="text" />
  <button class="search__button">搜索</button>
</div>
```

### 1.2.3. Modifier（修饰符）

修饰符定义块或元素的状态或变体。命名格式为： `block_modifier` 或 `block__element_modifier`

```html
<!-- 不同状态的按钮 -->
<button class="btn btn_primary">主要按钮</button>
<button class="btn btn_disabled">禁用按钮</button>
```

## 3. BEM命名规范详解

### 1.3.1. 命名规则

- 使用小写字母
- 单词间用连字符 `-` 连接
- 元素用双下划线 `__` 连接
- 修饰符用单个下划线 `_` 连接

### 1.3.2. 实际案例

```html
<!-- Block weui-page-->
<div class="weui-page">
  <!-- Element header-->
  <header class="weui-page__header">
    <!-- Element title-->
    <h1 class="weui-page__title">Button</h1>
    <!-- Element desc-->
    <p class="weui-page__desc">按钮</p>
  </header>
  <!-- Element body-->
  <main class="weui-page__body">
    <div class="button-sp-area">
      <a href="" class="weui-btn weui-btn_primary">主要操作</a>
      <a href="" class="weui-btn weui-btn_default">次要操作</a>
    </div>
    <div class="weui-cells">
      <h3 class="weui-cells__title">个人信息</h3>
      <div class="weui-cell">
        <div class="weui-cell__hd"></div>
        <div class="weui-cell__bd">
          <p>标题文字</p>
        </div>
        <div class="weui-cell__ft">说明文字</div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd"></div>
        <div class="weui-cell__bd">
          <p>标题文字</p>
        </div>
        <div class="weui-cell__ft">说明文字</div>
      </div>
    </div>
    <div class="weui-form">
      <div class="weui-form__hd"></div>
      <div class="weui-form__bd"></div>
      <div class="weui-form__ft"></div>
    </div>
  </main>
</div>
```

### 1.3.3. CSS实现

BEM命名规范与CSS的实现紧密结合，以下是对应的CSS代码示例：

```css
/* Block */
.weui-page {
  width: 100%;
  min-height: 100vh;
}

/* Element */
.weui-page__header {
  padding: 20px;
  background-color: #f8f8f8;
}

.weui-page__title {
  font-size: 24px;
  font-weight: bold;
}

.weui-page__desc {
  color: #666;
  margin-top: 10px;
}

/* Block with modifier */
.weui-btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
}

.weui-btn_primary {
  background-color: #1aad19;
  color: #fff;
}

.weui-btn_default {
  background-color: #f8f8f8;
  color: #000;
  border: 1px solid #ddd;
}
```

## 4. BEM最佳实践

### 1.4.1. 避免过度嵌套

BEM不鼓励深度嵌套，一般不超过2-3层：

```html
<!-- 不推荐 -->
<div class="block">
  <div class="block__element1">
    <div class="block__element1__element2">
      <!-- 内容 -->
    </div>
  </div>
</div>

<!-- 推荐 -->
<div class="block">
  <div class="block__element1">
    <div class="block__element2">
      <!-- 内容 -->
    </div>
  </div>
</div>
```

### 1.4.2. 保持命名简洁

命名要能清晰表达功能，但不要过于冗长：

```html
<!-- 推荐 -->
<div class="user-profile">
  <img class="user-profile__avatar" src="..." />
</div>

<!-- 不推荐 -->
<div class="user-profile-container-wrapper">
  <img class="user-profile-container-wrapper-avatar-image" src="..." />
</div>
```

### 1.4.3. 使用多个类名组合

对于复杂的状态组合，可以使用多个类名：

```html
<button class="btn btn_primary btn_large btn_disabled">提交</button>
```

### 1.4.4. 避免样式依赖

BEM的一个重要原则是减少样式依赖，每个块应该尽可能独立：

```css
/* 不推荐 */
.header .navigation .nav-item {
  /* 样式 */
}

/* 推荐 */
.nav-item {
  /* 样式 */
}
```

## 5. BEM在大型项目中的优势

### 1.5.1. 可维护性高

BEM的命名结构清晰，使代码更易于维护。当你看到一个类名如 `.product-card__title_highlighted`，你立即知道这是产品卡片中的标题元素，并且处于高亮状态。

### 1.5.2. 可复用性强

BEM鼓励组件化开发，每个块都是独立的，可以在不同页面或项目中复用。

```css
/* 这个按钮组件可以在任何地方使用 */
.btn {
  /* 基础样式 */
}

.btn_primary {
  /* 主要按钮样式 */
}

.btn_large {
  /* 大按钮样式 */
}
```

### 1.5.3. 团队协作顺畅

统一的命名规范减少沟通成本，新成员加入团队后能更快理解代码结构。

### 1.5.4. 减少样式冲突

BEM的命名方式几乎消除了样式冲突的可能性，不需要使用`!important`或高特异性选择器来覆盖样式。

## 6. BEM与其他CSS方法论的比较

### 1.6.1. BEM vs OOCSS

OOCSS（面向对象CSS）强调结构与皮肤分离，而BEM更注重组件的独立性和命名规范。

```css
/* OOCSS方式 */
.button {
  /* 结构 */
}
.skin-green {
  /* 皮肤 */
}

/* BEM方式 */
.button {
  /* 基础样式 */
}
.button_green {
  /* 绿色变体 */
}
```

### 1.6.2. BEM vs SMACSS

SMACSS（可扩展模块化CSS架构）将样式分为基础、布局、模块、状态和主题五类，而BEM更专注于组件本身的结构。

### 1.6.3. BEM vs Atomic CSS

Atomic CSS（原子CSS）使用大量单一功能的类名，而BEM使用语义化的类名描述组件结构。

```css
/* Atomic CSS方式 */
<div class="flex p-4 bg-blue text-white">
  <!-- 内容 -->
</div>

/* BEM方式 */
<div class="alert alert_info">
  <!-- 内容 -->
</div>
```

## 7. 常见问题与解决方案

### 1.7.1. 类名过长

**问题**：BEM类名可能会变得很长，如 `.super-long-block-name__very-detailed-element-name_specific-modifier`

**解决方案**：

- 使用简短但有意义的块名
- 考虑使用命名空间前缀
- 在预处理器中使用嵌套简化书写

```scss
// SCSS中的嵌套写法
.product {
  &__title {
    // .product__title 样式

    &_highlighted {
      // .product__title_highlighted 样式
    }
  }
}
```

### 1.7.2. 何时创建新块vs新元素

**问题**：难以决定某个UI部分应该是新块还是现有块的元素

**解决方案**：

- 如果组件可以独立存在并被复用，应该是块
- 如果组件只在特定上下文中有意义，应该是元素

### 1.7.3. 处理JavaScript交互

**问题**：如何在使用BEM的同时处理JavaScript交互

**解决方案**：

- 使用`data-`属性处理JavaScript交互，保持类名只用于样式
- 或使用`js-`前缀的类名专门用于JavaScript钩子

```html
<button class="btn btn_primary" data-action="submit">提交</button>

<!-- 或 -->
<button class="btn btn_primary js-submit-button">提交</button>
```

## 8. 总结

BEM是一种简单但强大的CSS命名方法论。通过将界面分解为块、元素和修饰符，它能帮助我们：

- 创建可维护的CSS代码
- 避免样式冲突
- 提高开发效率
- 促进团队协作

记住这个简单的公式：

```css
.block {
}
.block__element {
}
.block_modifier {
}
.block__element_modifier {
}
```

在大型项目中，采用BEM命名规范可以显著减少样式维护的痛苦，让你的CSS代码结构更加清晰，更易于理解和扩展。无论是个人项目还是团队协作，BEM都是一种值得尝试的CSS最佳实践。
