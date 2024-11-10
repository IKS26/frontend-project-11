# RSS-Reader

[![Maintainability](https://api.codeclimate.com/v1/badges/b61c00e63fbdc5911927/maintainability)](https://codeclimate.com/github/IKS26/frontend-project-11/maintainability)
[![Actions Status](https://github.com/IKS26/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/IKS26/frontend-project-11/actions)   [![CI](https://github.com/IKS26/frontend-project-11/actions/workflows/ci.yml/badge.svg)](https://github.com/IKS26/frontend-project-11/actions/workflows/ci.yml)

## Overview

RSS (Really Simple Syndication) is a format designed to describe news feeds, article announcements, and other online content. By subscribing to RSS feeds, users can receive updates from various websites in a single place, usually through a specialized service called an RSS reader or aggregator.

The **RSS-Reader** application allows users to aggregate multiple RSS feeds, making it easy to follow updates from blogs, news sites, and other sources in one place. With RSS-Reader, you can:

- Add an unlimited number of RSS feeds
- Get automatic updates with new posts added to the main feed
- Mark posts as read
- Preview posts in a modal window for quick reading

This application was developed as part of the Hexlet Frontend Development course.

## Interface Example

![RSS-Reader Interface](./assets/RSS-Reader.Interface.png)

## Features

- **Unlimited Feeds**: Add as many RSS feeds as you want, and view all posts in a single timeline.
- **Automatic Updates**: The app periodically checks feeds for new posts and displays them instantly.
- **Read/Unread Tracking**: New posts are displayed in bold. Once you view a post, it’s marked as read.
- **Modal Post Previews**: View a summary of each post in a modal window, with a link to the full article.

## Demo

The application is deployed on Vercel and is available here:
[RSS-Reader Demo on Vercel](https://frontend-project-11-nine-nu.vercel.app/)

## Installation

To install the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/IKS26/frontend-project-11.git
   cd frontend-project-11
   ```

2. Install dependencies:
   ```bash
   make install
   ```

3. Start development server:
   ```bash
   make develop
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the app.

## Scripts and Commands

- **Dependency Installation**:
  ```bash
  make install
  ```
- **Lint Check**:
  ```bash
  make lint
  ```
- **Auto-fix Lint Issues**:
  ```bash
  make lint-fix
  ```
- **Code Formatting**:
  ```bash
  make format
  ```
- **Project Build**:
  ```bash
  make build
  ```
- **Local Development**:
  ```bash
  make develop
  ```
- **Vercel Build**:
  ```bash
  make vercel-build
  ```

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Libraries and Frameworks**: [i18next](https://www.i18next.com/) for localization, [Bootstrap](https://getbootstrap.com/) for styling and modal dialogs
- **Tools**: [Webpack](https://webpack.js.org/) for module bundling, [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality and formatting, [Vercel](https://vercel.com/) for deployment

## Contributing

Feel free to open issues or submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.