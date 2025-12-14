# Contributing to ReBuild Homes SriLanka

First off, thank you for considering contributing to ReBuild Homes SriLanka! 🎉 It's people like you that make this platform better for communities affected by disasters.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, browser, Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### 🔨 Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit a pull request**

#### Pull Request Guidelines

- Fill in the required template
- Follow the TypeScript/Angular style guide
- Include relevant issue numbers
- Update the README.md if needed
- Add tests if applicable
- Ensure the build passes

## Development Setup

1. **Fork and clone the repo**
   ```bash
   git clone https://github.com/your-username/ReHome-SriLanka.git
   cd ReHome-SriLanka
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create your own Firebase project
   - Update environment configuration
   - See [Firebase Setup Guide](docs/10-FIREBASE-SETUP.md)

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes and test**
   ```bash
   npm run dev
   ```

6. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```

## Coding Standards

### TypeScript/Angular Style

- Follow [Angular Style Guide](https://angular.io/guide/styleguide)
- Use TypeScript strict mode
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add email notification for approved applications
fix: resolve beneficiary form validation issue
docs: update Firebase setup instructions
```

### File Structure

- Place components in `src/components/`
- Place services in `src/services/`
- Place models/interfaces in `src/models/`
- Place guards in `src/guards/`
- Update documentation in `docs/`

## Testing

- Test all new features and bug fixes
- Test on different browsers if UI changes are made
- Test with different user roles (Admin, Beneficiary, Donor)
- Verify Firebase security rules are working

## Documentation

- Update README.md for significant changes
- Update relevant documentation in `docs/` folder
- Add inline code comments for complex logic
- Update API documentation if backend changes are made

## Community

### Getting Help

- Check existing documentation in `/docs`
- Search existing issues
- Create a new issue with the `question` label
- Join discussions on GitHub Discussions

### Areas That Need Help

- 🌐 Internationalization/localization
- ♿ Accessibility improvements
- 📱 Mobile responsiveness
- 🧪 Test coverage
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔒 Security audits

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- GitHub contributors page

## Questions?

Feel free to open an issue with the `question` label or reach out to the maintainers.

---

Thank you for contributing to help disaster-affected communities! 🏠💙
