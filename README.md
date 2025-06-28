## Movies Frontend test-task

Uses weblylabhub/movies [docker image](https://hub.docker.com/r/webbylabhub/movies) as a backend service.

## To launch using Docker Image
1. Get this [frontend docker image](https://hub.docker.com/r/olehkulys/movies-frontend)
2. To connect to backend - pull this [backend docker image](https://hub.docker.com/r/webbylabhub/movies) and start it with `docker run --name movies -p 8000:8000 webbylabhub/movies`
3. Run frontend using `docker run --name movies-frontend -p 3000:80 -e API_BASE_URL=http://localhost:8000/api/v1 olehkulys/movies-frontend`, you can specify your backend URL, e.g `API_BASE_URL=http://localhost:2551/api/v5` or leave it as is

## To launch Development Server
1. Clone this repository 
2. `cd` into a directory of this cloned project
3. `run npm install`
4. Pull [backend docker image](https://hub.docker.com/r/webbylabhub/movies)
5. Run it with: `docker run --name movies -p 8000:8000 webbylabhub/movies` to start pulled image
6. Create `.env` file and specify there backend API URL with variable `VITE_API_URL`, check `.env.example` for example (Default backend link: http://localhost:8000/api/v1)
7. Now if VITE_API_URL is set to backend URL service, you can `npm run dev`
