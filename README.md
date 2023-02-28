**This is the test application that consist from 2 parts:**
./next-client - next.js app
./server - node.js app

**In order to run it locally:**

 1. Goes to the ./next-client folder and execute 'npm install'
 2. Goes to the ./server folder and execute 'npm install'
 3. Goes to the root folder ./ and execute 'docker-compose up -d --build'
 4. Waiting for all services will be started and open browser at
    'http://localhost:3000'


next-clent listening port 3000
server listening ws on port 7071
mongo listening default port 27017

Delay between rounds 10 seconds.
Graph clear delay is 3 seconds.
