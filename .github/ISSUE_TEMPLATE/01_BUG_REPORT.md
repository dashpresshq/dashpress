name: Bug Report
description: Create a report to help Hadmean to improve
body:
  - type: markdown
    attributes:
      value: |
        Hi, thank you for taking the time to create an issue!

        Before opening this issue, please make sure that:
        
        - You're using [the latest version of Hadmean](https://www.npmjs.com/package/hadmean).
        - There's [no other issue](https://github.com/hadmean/hadmean/issues?q=is%3Aopen+is%3Aissue+label%3Abug) that already describes the problem.
     
  - type: textarea
    attributes:
      label: Current behavior
      description: A clear and concise description of how the bug manifests.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Expected behavior
      description:
        Describe what you expect the behavior to be without the bug.
    validations:
      required: true

  - type: textarea
    attributes:
      label: Steps to reproduce
      description: Explain the steps required to duplicate the issue, especially if you are able to provide a sample application

  - type: input
    id: hadmean-version
    attributes:
      label: What version of Hadmean are you using?
      description: 'Version is displayed in the terminal. For example: 1.0.1'
    validations:
      required: true

  - type: input
    id: node-version
    attributes:
      label: What version of Node.js are you using?
      description: 'For example: 12.0.0'
    validations:
      required: true

  - type: input
    attributes:
      label: What database are you using?
      description: 'For example: Postgres 13, MySQL 5'
    validations:
      required: true

  - type: input
    attributes:
      label: What browser are you using?
      description: 'For example: Chrome, Safari'
    validations:
      required: true
  
  - type: textarea
    attributes:
      label: Other information
      description: List any other information that is relevant to your issue. Related issues, suggestions on how to fix, Stack Overflow links, forum links, etc.
