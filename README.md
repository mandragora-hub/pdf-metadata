# pdf-metadata

Script that fills with PDF metadata, pages and read time attribute the database of Litterarum.

For some reason this script uses a lot memory heap when. if we use the default Node memory it could return an error when process a large file, for example a file with many words. We solve this problem by running node with the next options: `--max-old-space-size=8192`.

## Local Variables

See the env example file.

## Running in local environment

```bash
#Install the dependencies
npm i 

# Start the script
npm start
```

## Running with docker

```bash
# Build image 
docker compose build

# Running 
docker compose up
```
