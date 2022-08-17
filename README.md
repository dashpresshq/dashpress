<h1 align="center">
  <a href="https://github.com/adminatorhq/adminator">
    <!-- Please provide path to your logo here -->
    <img src="docs/images/logo.svg" alt="Logo" width="100" height="100">
  </a>
</h1>

<div align="center">
  Adminator
  <br />
  <a href="#about"><strong>Explore the screenshots »</strong></a>
  <br />
  <br />
  <a href="https://github.com/adminatorhq/adminator/issues/new?assignees=&labels=bug&template=01_BUG_REPORT.md&title=bug%3A+">Report a Bug</a>
  ·
  <a href="https://github.com/adminatorhq/adminator/issues/new?assignees=&labels=enhancement&template=02_FEATURE_REQUEST.md&title=feat%3A+">Request a Feature</a>
  .<a href="https://github.com/adminatorhq/adminator/discussions">Ask a Question</a>
</div>

<div align="center">
<br />

[![Project license](https://img.shields.io/github/license/adminatorhq/adminator.svg?style=flat-square)](LICENSE)

[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-ff69b4.svg?style=flat-square)](https://github.com/adminatorhq/adminator/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
[![code with love by thrownullexception](https://img.shields.io/badge/%3C%2F%3E%20with%20%E2%99%A5%20by-thrownullexception-ff1414.svg?style=flat-square)](https://github.com/thrownullexception)

</div>

<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [How it looks](#how-it-looks)
  - [Motivation](#motivation)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Roadmap](#roadmap)
- [Support](#support)
- [Project assistance](#project-assistance)
- [Contributing](#contributing)
- [Authors & contributors](#authors--contributors)
- [Security](#security)
- [License](#license)
- [Built With](#acknowledgements)

</details>

---

## About

Adminator is a internal dashboard framework that reflects your database models. It is all batteries included but extremely customizable in the UI through checkboxes and text inputs

### How it looks
<img src="./docs/demo.gif" title="Adminator Demo" width="100%">

### Motivation
There are lot of good internal dashboard tools out there, The ones bundled with your framework are good but not usually highly customizable and they are obviously tied to your framework, The good ones are paid for and the free version are usually heavily restricted
The motivation for Adminator is to build something that is language or framework agnostic, doesn't need to watch vidoes for days to learn to use their drag and drop system, 
Even though is free, it is featured packed enough for most users to not look for a paid solution


## Getting Started

### Prerequisites

 - [Git](https://git-scm.com)
 - [Node.js](https://nodejs.org/en/download/)
 - [Yarn](https://yarnpkg.com/getting-started/install)
 - Supported database (MySQL, Postgres, MsSQL, SQLite)

### Installation

```bash
# Clone this repository
$ git clone https://github.com/adminatorhq/adminator <project_name>

# Go into the repository
$ cd <project_name>

# Install dependencies
$ yarn install

# Run the app
$ npm run start
```

## Usage
After installation, You will be asked to provide your database credentials and create your admin account and you will be able to start using the application

## Features
 - Authentication
 - Role and Permissions
 - Rich text editor
 - Users management
 - Deep navigation
 - CRUD
 - Data Count
 - Relationships
 - Synced DB Validation
 - Fields selection/ ordering
 - Cache configurations
 - Credentials Storage
 - Disabling/Hiding of forms
 - Introspection
 - Selection Colors
 - Form validation
 - Filters


## Roadmap

See the [open issues](https://github.com/adminatorhq/adminator/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/adminatorhq/adminator/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/adminatorhq/adminator/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/adminatorhq/adminator/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Reach out to the maintainer at one of the following places:
- [GitHub Discussions](https://github.com/adminatorhq/adminator/discussions)
- Contact options listed on [this GitHub profile](https://github.com/thrownullexception)

## Project assistance

If you want to say **thank you** or/and support active development of Adminator:

- Add a [GitHub Star](https://github.com/adminatorhq/adminator) to the project.
- Tweet about Adminator.
- Write interesting articles about Adminator on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or your personal blog.

Together, we can make Adminator **better**!

## Contributing

First off, thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.


Please read [our contribution guidelines](docs/CONTRIBUTING.md), and thank you for being involved!

## Authors & contributors

The original setup of this repository is by [Ayobami Akingbade](https://github.com/thrownullexception).

For a full list of all authors and contributors, see [the contributors page](https://github.com/adminatorhq/adminator/contributors).

## Security

Adminator  takes security at heart and follows all known good practices of security, but 100% security cannot be assured.
Adminator is provided **"as is"** without any **warranty**. Use at your own risk.

_For more information and to report security issues, please refer to our [security documentation](docs/SECURITY.md)._

## Built With
- KnexJS
- NextJS
- Typescript
- React Query
- React Table
- React Final Form
- Styled-components
- Class Validator
- Zustand 
- Bootstrap
- Prismjs

## License

This project is licensed under the **GNU General Public License v3**.

See [LICENSE](LICENSE) for more information.
