
# Documentation

CLUAR CMS facilitates the creation of websites using ReactJS but with the maintenance of content, navigation, pages, languages, settings and much more, through a back office provided by the Neptune platform.

For those who are starting to learn about ReactJS & CSS, you will be able to create a modern and customized website in a very practical and intuitive way.

For those who already master ReactJS & CSS, you will be able to greatly reduce the implementation time of dynamic websites with content management, so you can focus more on design and advanced customizations.

## Overview

These are the main mechanisms that CLUAR CMS offers by default:

1. [Page](page/README.md)
2. [Language](language/README.md)
3. [Contents](content/README.md)
4. [Standard](banner/README.md)
5. [Listing](listing/README.md)
6. [Action](action/README.md)
7. [Dictionary](dictionary/README.md)
8. [Settings](configuration/README.md)
9. [Funcionalidade](functionality/README.md)

#### Estrutura do Código do Website

The code is organized as follows:

- `website/src/base`
  Contains the header (`header` and `menu`) and footer (`footer`) components, as well as the cookie privacy alert.

- `website/src/common`
  Essential and useful code in general, as well as the page processing engine (`Builder`)

- `website/src/components`
  Components to be used to build the contents of the pages.

- `website/src/components/functionality`
  Contains custom-made components to be integrated into page content.

- `website/src/config`
  Parameterization of the essential configuration used in code.
  
- `website/src/styles`
  Here it contains the main and global CSS, with the management of the variables (`variables`) of layout and design settings.

- `website/src/pages`
  Custom developed pages without being processed by the CLUAR CMS engine.
  
- `website/src/App.js`
  Definition of navigation routes (`react-router-dom`) and has the overall structure of the website. 

- `website/src/index.js`
  This is where it all starts, it is also where the base content of the CLUAR CMS is loaded and where it defines the address of the REST API of services.

- `website/craco.config.js`
  Customizing Ant.Design layout and design variables

#### Netuno Application Code Structure

About the structure of the Neptune application:

- `config`
  Netuno application configuration as database, commands executed at startup, CORS, SMTP, and much more.

- `dbs`
  Where are the database files (`H2Database`) and where scripts for other types of databases can be stored.

- `public`
  Public files of the Netuno application.
  
- `server`
  Netuno application server code.
  
- `server/sevices`
  Code programming REST API services.

- `storage`
  General files managed by the Netuno application server.

- `ui`
  Dashboard programming that is in the backoffice of the Netuno application.

## Layout & Design Customization

To customize the appearance CSS is used, so just edit all the `.less` files that are inside the `website/src` folder and in the respective subdirectories.

The central and global LESS code is in `website/src/styles`, inside this folder the file `variables.less` has the main parameters of global styles.

### Ant.Design styling

The styling of Ant.Design is done in the `website/craco.config.js` file, inside the `less` settings is to configure the Ant.Design variables in `modifyVars`, check the Ant.Design variables that can be redefined:

- [themes/default.less](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

## ReactJS Components

The main components

## Header e Menu

- `website/src/base/Header`
  Contains the files responsible for the header and menu.

## Footer

- `website/src/base/Footer`
  Contains the files responsible for the footer.

## Engine

- `website/src/common/Cluar.js`
- `website/src/common/Builder.js`
  Files Responsible for building the interface.


## Routes with React Router

- `website/src/App.js`
  File responsible for defining the routes.


