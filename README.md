# Personal Loan Widget

## Table of Contents

+ [About](#about)
+ [Getting Started](#getting_started)
+ [Usage](#usage)
+ [Add Ons](#add_ons)
+ [Contributing](#contributing)
+ [Licence](#license)

## About <a name="about"></a>

Widget that allows customers to simulate and apply for a personal loan with the information and terms they need

| Functionality         | Description                                                                          |
|:----------------------|:-------------------------------------------------------------------------------------|
| Loan Amount           | The loan amount to be requested from to the institution.                             |
| Payments              | Shows the total payment amounts for the requested personal loan.                     |
| Months of non-payment | This section allows customers to select the months of their grace period.            |
| Grace period          | If necessary, customers can select non-payment dates for their personal loan.        |
| Destination account   | Corresponds to the account in which the requested loan amount will be deposited.     |
| Insurance             | Shows different types of insurance that clients can add to their loans if necessary. |

## Getting Started

These instructions will get you a copy of the Widget up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on Modyo.

### Development Setup

This project requires NodeJS (version LTS or later), NPM and YARN.
[Node](http://nodejs.org/), [NPM](https://npmjs.org/) and [YARN](https://yarnpkg.com/) are really easy to install. To make sure you have them available on your machine, try running the following command.

```sh
node -v
npm -v
yarn -v
```

Also you will need the [Modyo CLI](https://docs.modyo.com/platform/channels/widgets.html#modyo-cli) tool installed globally on your local machine.

```sh
npm i -g @modyo/cli #via npm
yarn global add @modyo/cli #via yarn
```

### Installing

**BEFORE YOU INSTALL:** please read the **Development Setup** above.

To install a copy of this Widget on your local machine:

```sh
modyo-cli get modyo-widgets-retail-consumer-loan [DIRECTORY]
```

This command will clone the Widget and install it's dependencies.

## Usage

### Serving the Widget

```sh
yarn serve
```

### Running the tests and linters

```sh
yarn test:unit
yarn lint
yarn lint:styles
```

### Get a I18N report to check for missing translations or status

```sh
yarn i18n:report
```

### To create a production build

```sh
yarn build
```

This task will create a distribution version of the Widget inside your local `dist/` folder

### Serving a production version

```sh
yarn serve --mode=production
```
## License

SEE LICENSE IN [LICENSE.md](/LICENSE.md)
