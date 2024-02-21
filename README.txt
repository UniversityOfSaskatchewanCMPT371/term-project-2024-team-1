README for semantic versioning

A basic automated semantic version release that helps to release a new version with its release notes when code is pushed on main branch.
ABC123

### Given a version number MAJOR.MINOR.PATCH, increment the:
  **PATCH -> fix:** version when you make backward compatible bug fixes.\
  **MINOR -> feat:** version when you add functionality in a backward compatible manner.\
  **MAJOR -> BREAKING CHANGE:** version when you make incompatible API changes.

### commit convention for main branch:
  **fix: bug fix description for a patch release.   
  feat: new feature description for a minor release.   
  BREAKING CHANGE: description of breaking change for a major release.**

  ***Example: ```git commit -m "fix: YOUR MESSAGE"```***


  other useful conventions:

    1. Documentation:
        docs: update documentation
        docs: add README.md
        
    2. Testing:
        test: add unit tests
        test: update integration tests
    
    3.Refactoring:
        refactor: simplify code
        refactor: rename variable for clarity
        
    4. Chore:
        chore: run linter
        chore: update dependencies
    
    5. Style:
        style: fix formatting issues
        style: update CSS styling
    
    6. Build:
        build: configure webpack settings
        build: update build scripts
    
    7. Performance:
        perf: improve algorithm efficiency
        perf: optimize database queries
    
    8. Dependency Management:
        deps: update third-party library
        deps: bump version of dependency
        
    9. Localization/Internationalization:
        i18n: translate error messages
        i18n: add support for French
    
    10. Security:
        security: fix security vulnerability
        security: update dependency to address security issue

  