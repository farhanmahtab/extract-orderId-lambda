### Prepare lambda:

- create a file the lambda folder for listing down event variable. Example name: `e.json`
- Write down the environment you want to run at the `env` variable. Example:

```bash
{
    "env": "dev"
}
```

- Create a file name `config.json` in the config folder and copy the json structure from `config.json.example` file in it.
- Update the values in `config.json` file according to the environment.
- Run the following commanded from the root of the project to finish preparing the lambda

```bash
cd lambda_folder_name
npm i
```

### Upload in AWS lambda

- Zip the considered lambda folder.
- Upload the zip in aws lambda

### Run lambda locally

Assuming that the event file name is `e.json` and you want to run the lambda for not more then 120 second.

```bash
lambda-local -l index.js -h handler -e e.json -t 120
```
