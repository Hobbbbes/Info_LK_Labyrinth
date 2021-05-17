FROM debian:latest

ENV DEBIAN_FRONTEND 'noninteractive'
RUN apt update && apt -y upgrade && apt install -y git nodejs npm 
RUN git clone https://github.com/poodlenoodle42/Info_LK_Labyrinth.git
WORKDIR /Info_LK_Labyrinth
RUN npm install

CMD ["npm","run","dev"]