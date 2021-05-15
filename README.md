# Personal Loan Widget

## Table of Contents

+ [About](#about)
+ [Getting Started](#getting_started)
+ [Usage](#usage)
+ [Contributing](../CONTRIBUTING.md)

## About <a name="about"></a>

Modyo also offers a widget that allows customers to simulate and apply for a personal loan with the information and terms they need

| Functionality         | Description                                                                          |
|:----------------------|:-------------------------------------------------------------------------------------|
| Loan Amount           | The loan amount to be requested from to the institution.                             |
| Payments              | Shows the total payment amounts for the requested personal loan.                     |
| Months of non-payment | This section allows customers to select the months of their grace period.            |
| Grace period          | If necessary, customers can select non-payment dates for their personal loan.        |
| Destination account   | Corresponds to the account in which the requested loan amount will be deposited.     |
| Insurance             | Shows different types of insurance that clients can add to their loans if necessary. |

## Getting Started <a name="getting_started"></a>

These instructions will get you a copy of the Widget up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on Modyo.

### Prerequisites

This project requires NodeJS (version LTS or later) and NPM or YARN.
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

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites) above.

To install a copy of this Widget on your local machine:

```sh
modyo-cli get modyo-widgets-retail-consumer-loan [DIRECTORY]
```

This command will clone the Widget and install it's dependencies.

## Usage

### Serving the Widget

```sh
npm run serve
```

### Running the tests and linters

```sh
npm run test:unit
npm run lint
npm run lint:styles
```

### Get a I18N report to check for missing translations or status

```sh
npm run i18n:report
```

### Building a distribution version

```sh
npm run build
```

This task will create a distribution version of the Widget inside your local `dist/` folder

### Serving the distribution version

```sh
npm run serve --prod
```

## License

SEE LICENSE IN [LICENSE.md](/LICENSE.md)
