# Clear Convey Design System
## Dreamy Interactive Animation Toolkit

This design system contains the color palette, gradients, and animation patterns used in Clear Convey. Perfect for creating dreamy, interactive tools with fluid animations.

---

## 🎨 Color Palette

### Primary Colors
```css
/* Teal/Cyan family - main brand color */
--primary: #94DCDE;
--primary-dark: #6BBFC2;
--primary-light: #B8E7E9;
--primary-bg: #F0FBFC;

/* Purple family - secondary accent */
--secondary: #C692CA;
--secondary-dark: #A56BA9;
--secondary-light: #D9B3DD;
--secondary-bg: #F7F0F8;

/* Pink accent - for emphasis */
--accent: #E761BD;
--accent-dark: #D23FA0;
--accent-light: #F189D0;
--accent-bg: #FDF2F9;

/* Success/Bright cyan */
--success: #83F5E5;
--success-dark: #43a796;
--success-bg: rgba(131, 245, 229, 0.1);
```

### Neutrals
```css
--surface: #FAFBFC;
--background: #F5F7F8;
--background-alt: #FFFFFF;
--border: #E1E8EA;
--border-light: #F0F4F5;
--text-primary: #1A2B2E;
--text-muted: #7A8B8E;
```

---

## ✨ Mesh Gradient System

### Base HTML Structure
```html
<div class="mesh-loader-overlay show">
  <div class="mesh-gradient-blob mesh-blob-1"></div>
  <div class="mesh-gradient-blob mesh-blob-2"></div>
  <div class="mesh-gradient-blob mesh-blob-3"></div>
</div>
```

### Core Gradient Styles
```css
.mesh-loader-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(.77,0,.18,1);
  will-change: opacity;
  border-radius: 20px;
  overflow: hidden;
}

.mesh-loader-overlay.show {
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

.mesh-gradient-blob {
  position: absolute;
  width: 40%;
  height: 40%;
  border-radius: 44% 56% 60% 40% / 53% 40% 60% 47%;
  filter: blur(25px) brightness(1.2) saturate(1.4);
  opacity: 0.8;
  mix-blend-mode: multiply;
  animation: meshMove1 8s ease-in-out infinite alternate;
  transition: opacity 0.5s;
}

/* Gradient Definitions */
.mesh-blob-1 {
  background: radial-gradient(
    circle at 30% 70%,
    #D9B3DD, /* light purple */
    #B8E7E9 70%, /* light teal */
    transparent 100%
  );
  left: 10%;
  top: 10%;
  animation-name: meshMove1;
}

.mesh-blob-2 {
  background: radial-gradient(
    circle at 60% 40%,
    #83F5E5, /* cyan */
    #94DCDE 60%, /* teal */
    transparent 100%
  );
  right: 10%;
  bottom: 10%;
  animation-name: meshMove2;
  animation-delay: 2s;
}

.mesh-blob-3 {
  background: radial-gradient(
    circle at 70% 80%,
    #B8E7E9, /* light teal */
    #83F5E5 70%, /* cyan */
    transparent 100%
  );
  left: 25%;
  top: 25%;
  animation-name: meshMove3;
  animation-delay: 4s;
}
```

---

## 🎭 Animation Library

### Floating Movement Animations
```css
@keyframes meshMove1 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(5%, 3%) scale(1.05); }
  100% { transform: translate(-3%, 5%) scale(1); }
}

@keyframes meshMove2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-3%, -2%) scale(1.08); }
  100% { transform: translate(3%, -1%) scale(0.98); }
}

@keyframes meshMove3 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-1%, 3%) scale(1.06); }
  100% { transform: translate(2%, -2%) scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}
```

### Smooth Transitions
```css
/* Cubic bezier curves for smooth animations */
--ease-smooth: cubic-bezier(.77,0,.18,1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);

/* Example usage */
.interactive-element {
  transition: all 0.5s var(--ease-smooth);
}
```

---

## 🌈 Interactive Gradient Variations

### 1. Aurora Borealis Effect
```css
.aurora-gradient {
  background: linear-gradient(
    135deg,
    rgba(148, 220, 222, 0.3) 0%,
    rgba(131, 245, 229, 0.2) 25%,
    rgba(198, 146, 202, 0.3) 50%,
    rgba(231, 97, 189, 0.2) 75%,
    rgba(184, 231, 233, 0.3) 100%
  );
  animation: aurora 15s ease-in-out infinite;
}

@keyframes aurora {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(1deg) scale(1.02); }
  50% { transform: rotate(-1deg) scale(1.01); }
  75% { transform: rotate(0.5deg) scale(1.03); }
}
```

### 2. Morphing Blob Effect
```css
.morph-blob {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: morph 8s ease-in-out infinite;
}

@keyframes morph {
  0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}
```

### 3. Iridescent Shimmer
```css
.iridescent {
  background: linear-gradient(
    45deg,
    #94DCDE,
    #83F5E5,
    #C692CA,
    #E761BD,
    #94DCDE
  );
  background-size: 300% 300%;
  animation: shimmer 5s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

---

## 🎮 Interactive States

### Hover Effects
```css
.dreamy-hover {
  position: relative;
  overflow: hidden;
}

.dreamy-hover::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle,
    rgba(131, 245, 229, 0.4) 0%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.dreamy-hover:hover::before {
  opacity: 1;
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  from { transform: scale(0.5); }
  to { transform: scale(1.5); opacity: 0; }
}
```

### Click/Touch Feedback
```css
.touch-bloom {
  position: relative;
}

.touch-bloom::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle,
    rgba(148, 220, 222, 0.6),
    rgba(198, 146, 202, 0.4),
    transparent
  );
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
}

.touch-bloom:active::after {
  animation: bloom 0.5s ease-out;
}

@keyframes bloom {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}
```

---

## 🔧 React Component Example

```jsx
import React, { useState } from 'react';
import './dreamy-styles.css';

const DreamyInteractiveElement = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="dreamy-container">
      <div className={`mesh-loader-overlay ${isActive ? 'show' : ''}`}>
        <div className="mesh-gradient-blob mesh-blob-1"></div>
        <div className="mesh-gradient-blob mesh-blob-2"></div>
        <div className="mesh-gradient-blob mesh-blob-3"></div>
      </div>
      
      <div 
        className="interactive-content dreamy-hover touch-bloom"
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default DreamyInteractiveElement;
```

---

## 💡 Implementation Tips

### Performance Optimization
1. Use `will-change` sparingly on animated elements
2. Prefer `transform` and `opacity` for animations (GPU-accelerated)
3. Use `pointer-events: none` on decorative overlays
4. Implement `prefers-reduced-motion` media query for accessibility

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Blend Modes for Different Effects
- `multiply` - Darkens, good for overlays on light backgrounds
- `screen` - Lightens, good for glowing effects
- `overlay` - Combines multiply and screen
- `soft-light` - Subtle version of overlay
- `color-dodge` - Creates bright, saturated colors

### Accessibility Considerations
```css
/* Ensure text remains readable */
.content-with-gradient {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 10px;
}
```

---

## 🚀 Quick Start

1. Copy the color palette variables to your CSS
2. Include the mesh gradient HTML structure
3. Add the animation keyframes
4. Customize the blob colors and animations to fit your needs
5. Adjust opacity, blur, and blend modes for your specific use case

### Minimal Setup
```css
/* Essential imports */
:root {
  --primary: #94DCDE;
  --primary-light: #B8E7E9;
  --secondary-light: #D9B3DD;
  --success: #83F5E5;
}

/* Copy the mesh gradient styles and animations from above */
```

---

## 📦 NPM Package Suggestions

For enhanced animations:
- `framer-motion` - React animation library
- `react-spring` - Spring-physics animations
- `lottie-react` - Complex animations via After Effects
- `three.js` - 3D gradient effects
- `react-parallax` - Depth and movement

---

*Created from Clear Convey's design system - a tool for polishing web writing with beautiful, dreamy animations.*