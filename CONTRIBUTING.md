# Contributing to CIDCO Mitra Admin Panel

## 📋 Code Standards

### JavaScript/React Standards

1. **Component Structure**
   - Use functional components with hooks
   - Keep components small and focused
   - Extract reusable logic into custom hooks

2. **Naming Conventions**
   - Components: PascalCase (e.g., `UserList.jsx`)
   - Files: camelCase for utilities (e.g., `formatters.js`)
   - Constants: UPPER_SNAKE_CASE (e.g., `LEAD_STATUS`)
   - Functions: camelCase (e.g., `handleSubmit`)

3. **File Organization**
   ```
   ComponentName/
   ├── ComponentName.jsx
   ├── ComponentName.test.jsx
   └── index.js
   ```

### CSS/Tailwind Standards

1. **Use Tailwind Utilities**
   - Prefer Tailwind classes over custom CSS
   - Use consistent spacing (4px base unit)
   - Follow the design system colors

2. **Responsive Design**
   - Mobile-first approach
   - Use Tailwind breakpoints (sm, md, lg, xl)
   - Test on multiple screen sizes

### State Management

1. **Zustand Stores**
   - Keep stores focused and small
   - Use actions for state updates
   - Persist only necessary data

2. **Component State**
   - Use local state for UI-only data
   - Lift state up when needed by multiple components

## 🔧 Development Workflow

### 1. Setup Development Environment

```bash
git clone <repository-url>
cd cidco-mitra-admin
npm install
cp .env.example .env
npm run dev
```

### 2. Create a New Feature

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Write clean, readable code
- Follow existing patterns
- Add comments for complex logic
- Update documentation if needed

### 4. Test Your Changes

- Test all affected features
- Check responsive design
- Verify in different browsers
- Test with different user roles

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

Commit message format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build/config changes

### 6. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

## 🎨 Adding New Components

### UI Component Template

```jsx
export default function ComponentName({ 
  prop1, 
  prop2,
  className = '',
  ...props 
}) {
  return (
    <div className={`base-classes ${className}`} {...props}>
      {/* Component content */}
    </div>
  )
}
```

### Page Component Template

```jsx
import PageHeader from '../../components/common/PageHeader'
import Card from '../../components/ui/Card'

export default function PageName() {
  return (
    <div>
      <PageHeader
        title="Page Title"
        description="Page description"
      />

      <Card>
        {/* Page content */}
      </Card>
    </div>
  )
}
```

## 📝 Documentation

### Component Documentation

Add JSDoc comments for complex components:

```jsx
/**
 * Button component with multiple variants
 * @param {string} variant - Button style variant (primary, secondary, ghost, danger)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Disable button
 * @param {ReactNode} children - Button content
 */
export default function Button({ variant, size, disabled, children }) {
  // ...
}
```

## 🐛 Bug Reports

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information
- User role when bug occurred

## ✨ Feature Requests

When requesting features:
- Describe the feature clearly
- Explain the use case
- Provide mockups if possible
- Consider impact on existing features

## 🔍 Code Review Guidelines

### For Reviewers

- Check code quality and standards
- Verify functionality works as expected
- Test responsive design
- Check for security issues
- Provide constructive feedback

### For Contributors

- Respond to feedback promptly
- Make requested changes
- Re-test after changes
- Update PR description if scope changes

## 🚀 Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Test thoroughly
5. Merge to main
6. Tag release
7. Deploy to production

## 📞 Getting Help

- Check existing documentation
- Search closed issues
- Ask in team chat
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the project's license.
