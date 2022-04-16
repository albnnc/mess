# Environment

The development of both frontend and backend requires dev environment, which is
backed by docker for this project. For now, docker compose is used for
environment setup. Most likely, it will be extended to docker stack later.

The following line will start up everything you need, except project related
services:

```sh
$ docker-compose up
```

# Testing

Once docker will finish environment setup, you shall be able to run tests via
connecting to docker-provided services. However, you should not include service
URLs into tests code directly, since tests must be able to be executed in docker
completly via docker compose profile.

That said, the best way to write tests is to use environment variables as entry
points to provided services, such as NATS, MongoDB, etc.

For local development you need to source variables from `.env` file. The
[dotenv plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/dotenv)
for ohmyzsh might be the best way to do so.

The second option is to run tests in container directly. For this you need to
run `test` compose profile:

```sh
$ docker-compose run test
```

# Backend Testing

Standard [deno testing](https://deno.land/manual/testing) is widely used for
backend development. The core rule is to try to write independent tests where
possible, but not to overengineer it. This means that separate functions should
be tested and these tests should not include other to be tested functions usage.
For example, if one function implements certain scenario, its tests should
either not include calls of nested scenario functions or not exist at all. Mocks
are generally considered too complicated, since environment is mostly provided
by dev tools.

# Contributing

When committing, one should follow guidelines described in this document and
particular module docs. Commit messages must follow
[conventional commits](https://www.conventionalcommits.org/) rules.
