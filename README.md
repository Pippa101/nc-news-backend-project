To clone and use this repo effectively to interact with the databases, you must set the envronment variables.

To do this:

- create 2 .env files to declare the environemtn variable
- create a .env.test file to set the environment variable to the test database. To do this add PGDATABASE=<database_name_here_test>.
- create a .env.developemnt file to set the environment variable to the test database. To do this add PGDATABASE=<test_database_name_here>.
- ensure you have added these files in the .gitignore file in order to stop the environment variables being uploaded to gitHub and shared.
