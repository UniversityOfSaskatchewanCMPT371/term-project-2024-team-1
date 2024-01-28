# Semantic Versioning
A basic automated semantic version release that helps to release a new version with its release notes when code is pushed on main branch.

### Given a version number MAJOR.MINOR.PATCH, increment the:
  **PATCH -> fix:** version when you make backward compatible bug fixes.\
  **MINOR -> feat:** version when you add functionality in a backward compatible manner.\
  **MAJOR -> BREAKING CHANGE:** version when you make incompatible API changes.

### Commit convention for main branch:
  **fix: bug fix description for a patch release.   
  feat: new feature description for a minor release.   
  BREAKING CHANGE: description of breaking change for a major release.**

  ***Example: ```git commit -m "fix: YOUR MESSAGE"```***


### Other useful conventions:
```
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
```

# React Native Expo Dockerization
This solution is slightly different from the usual, as all the libraries/dependencies are on your local host. The Docker container provides a runtime environment.
*Do not add any files in the 'node_modules' directory to '.gitignore'.*
### Preparation
1. Install and run Docker Desktop from [Docker Get Started](https://www.docker.com/get-started).
2. Install the Expo Go app on your phone from [Expo Client](https://expo.dev/client).
3. Obtain your ip address.
	**Note:** *Do not use a browser to search for your IP address, as it might give you an incorrect result.*
- Open Terminal and enter the following command: 
	```Bash
	$ ipconfig getifaddr en0
	```
- Example output: `10.237.206.64` (This is a UofS-Secure private address.).
### Run Docker Container
1. In the directory `term-project-2024-team-1/front-end`, run the following command:
```bash
$ docker-compose up --build
```
### Opening the Front-End
1. Open a web browser and enter the following URL: `exp://10.237.206.64:8081`. _(Replace `10.237.206.64` with the IP address you obtained earlier.)_
2. This should automatically open the Expo Go app and start loading the front-end.
