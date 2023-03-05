<h1 align="center">
  <a href="https://github.com/hadmean/hadmean">
    <img src="https://hadmean.com/img/logo.png" alt="Logo" height="100">
  </a>
</h1>

<div align="center">

[![Project license](https://img.shields.io/github/license/hadmean/hadmean.svg)](LICENSE)
[![Pull Requests welcome](https://img.shields.io/badge/PRs-welcome-23bc42.svg)](https://github.com/hadmean/hadmean/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22)
<img src="https://img.shields.io/npm/v/hadmean" />
<img src="https://img.shields.io/github/languages/top/hadmean/hadmean" />


[![Maintainability](https://api.codeclimate.com/v1/badges/23516bfbcca7557d80a5/maintainability)](https://codeclimate.com/github/hadmean/hadmean/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/23516bfbcca7557d80a5/test_coverage)](https://codeclimate.com/github/hadmean/hadmean/test_coverage)
<img src="https://img.shields.io/codeclimate/tech-debt/hadmean/hadmean" />
![GitHub CI](https://github.com/hadmean/hadmean/actions/workflows/release.yml/badge.svg)


</div>

<div align="center">
  <a href="https://demo.hadmean.com" target="_blank">Live Demo</a>
  ·
  <a href="https://discord.gg/aV6DxwXhzN" target="_blank">Join Community</a>
    ·
  <a href="https://hadmean.com" target="_blank">Documentation</a>
</div>


<details open="open">
<summary>Table of Contents</summary>

- [About](#about)
  - [Demo](#demo)
  - [Features Walkthrough Video](#features-walkthrough-video)
  - [Motivation](#motivation)
  - [Why you should try Hadmean](#why-you-should-try-hadmean)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
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
Hadmean generates powerful admin apps from your database information 
- With just one command
- Under 30 seconds 
- No tutorial
- No learning curve
- No drag and drop
- No technical skills required
- Zero maintenance 

What you get is a fully functional admin app that is ready to be deployed.

Hadmean will help you focus your engineering resources on building exciting features and not building and maintaining boring and repetitive CRUD apps.

### Demo
https://demo.hadmean.com is an example admin app generated with Hadmean without writing any line of code.

### Features Walkthrough Video
Click on the image below to see a walkthrough of the many features Hadmean provides.

[![Watch the video](https://img.youtube.com/vi/aO500EjHw1c/mqdefault.jpg)](https://youtu.be/aO500EjHw1c)


### Motivation
Most internal tool applications make you build from the ground up i.e you get a blank canvas, drag and drop components, and wire them together with SQL and Javascript/Python to satisfy your business requirement. This I believe has many problems.

- They require some technical knowledge. 
- They require some learning curve. 
- They require time to build.
- You duplicate a lot of business logic already in your database.
- You to maintain them. 

Hadmean attempts internal tool generation with a new approach by introspecting your database and building a multi-page application based on all the info it can find like your field types, relationships, constraints etc. You literally can have your admin app done in seconds without any tutorial or coding.

### Why you should try Hadmean
- It is free
- Easiest installation, Just one command to install and run
- You will always be running the latest version
- The little learning curve with truly less than 5% technical knowledge requirement
- Tons of features
- Language/framework agnostic
- Lastly, It is open source.

## Getting Started

### Prerequisites
 - [Node.js](https://nodejs.org/en/download/)
 - Supported database (MySQL, Postgres, MsSQL, SQLite)

### Installation

```bash
$ cd <project_name>

$ npx hadmean
```

That is all, You will be able to see the application on http://localhost:3000.

If you prefer to use Docker, Check the `Dockerfile.example` file in the root folder of the repo.


## Features
 - One line installation 
 - Authentication
 - Role and Permissions
 - Users management
 - Dashboard builder 
 - CRUD
 - Form validation
 - Powerful form manipulation (hiding fields, disabling fields, editing values before submitting)
 - Relationships
 - Powerful Filters
 - DB Introspection
 - Color Customization
 - Rich text editor
 - Deep navigation
 - Reusable Queries
 - Views
 - Data Count
 - Synced DB Validation
 - Fields selection/ordering
 - Cache
 - Secure Credentials Storage
 - Forms fields customization
 - Selection Colors


## Roadmap

See the [open issues](https://github.com/hadmean/hadmean/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/hadmean/hadmean/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/hadmean/hadmean/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/hadmean/hadmean/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Join the community at one of the following places:
- [Discord](https://discord.gg/aV6DxwXhzN)
- [Twitter](https://twitter.com/hadmeanHQ)
- [GitHub Discussions](https://github.com/hadmean/hadmean/discussions)


## Project assistance

If you want to say **thank you** or/and support the active development of Hadmean:

- Add a [GitHub Star](https://github.com/hadmean/hadmean) to the project.
- Tweet about Hadmean.
- Write interesting articles about Hadmean on [Dev.to](https://dev.to/), [Medium](https://medium.com/) or your blog.

Together, we can make Hadmean **better**!

## Contributing

First off, thanks for taking the time to contribute! Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.


Please read [our contribution guidelines](docs/CONTRIBUTING.md), and thank you for being involved!

## Authors & contributors

The original setup of this repository is by [Ayobami Akingbade](https://github.com/thrownullexception).

For a full list of all authors and contributors, see [the contributors page](https://github.com/hadmean/hadmean/contributors).

## Security

Hadmean takes security at heart and follows all known good practices of security, but 100% security cannot be assured.
Hadmean is provided **"as is"** without any **warranty**.

_For more information and to report security issues, please refer to our [security documentation](docs/SECURITY.md)._

## Built With
- [KnexJS](https://github.com/knex/knex)
- [React](https://github.com/facebook/react)
- [NextJS](https://github.com/vercel/next.js)
- [Typescript](https://github.com/microsoft/TypeScript)
- [React Query](https://github.com/TanStack/query)
- [React Table](https://github.com/TanStack/table)
- [React Final Form](https://github.com/final-form/react-final-form)
- [Styled-components](https://github.com/styled-components/styled-components)
- [Class Validator](https://github.com/typestack/class-validator)
- [Zustand](https://github.com/pmndrs/zustand) 

## License

This project is licensed under the **GNU Affero General Public License v3.0**.

See [LICENSE](LICENSE) for more information.
