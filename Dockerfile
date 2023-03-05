FROM node:18-alpine

ENV NODE_ENV=production

RUN npm install -g hadmean

WORKDIR /app

EXPOSE 3000

CMD ["hadmean"]

# Steps to use

# 1. Copy the content of this file (mostly the uncommented part) to ${PATH_TO_SOMEWHERE}/Dockerfile

# 2. Open your terminal and cd to ${PATH_TO_SOMEWHERE}/Dockerfile

# 3. Build the image 
# docker build . -t hadmean

# 4. Run the image
# docker run -p ${YOUR_DESIRED_PORT}:3000  -v ${PATH_TO_SOMEWHERE}:/app -d hadmean
# ${YOUR_DESIRED_PORT} is the port on the host you want to run Hadmean on
# The `${PATH_TO_SOMEWHERE}:/app` is needed to sync the hadmean files 
# like the .env, .config-data etc out to your system so that you can edit/view it easily