<img src="/client/src/assets/Logos.png" alt="alt text" width="263" height="145">

# Auction Display Project
Auction Display Project is a project created to help display exhibitor, buyer, addon buyer, and sale information during a live county fair auction. The application is comprised of a front-end web application server, a back-end API server, and a database server that can all be run on a host machine inside of a local network. The system is designed to connect with other computers or Raspberry PI or similar devices that act as endpoints for displaying the data on a monitor(s).

## Technologies
Auction Display Project is built using a _**MEVN**_ stack which consists of:
* **MongoDB** ([NoSQL](https://www.mongodb.com/nosql-explained?jmp=footer)) for the database system and database server
* **Express.js** for the Node.js web application framework
* **Vue.js** for the front-end, client-side web server
* **Node.js** for the primary back-end server functionality

To learn more about the MEVN stack, and to see the tutorial we used as a foundation for starting this project, click [here](https://medium.com/@anaida07/mevn-stack-application-part-1-3a27b61dcae0).

## Getting Started
To get started, you will need to download and install MongoDB and Node.js on a host machine or virtual machine for the server. It should also work in a Docker container; however, this has not yet been tested.
* Install [MongoDB](https://docs.mongodb.com/manual/installation/) (created with version 3.0.15)
* Install [Node.js](https://nodejs.org/en/download/) (created with version 8.12.0)
* Install [Vue.js CLI](https://cli.vuejs.org/guide/installation.html) (created with version 2.9.6)
```bash
npm install -g vue-cli
```
* Clone the GitHub repository
```bash
git clone https://github.com/Cahough/Auction-Display-Project.git
```
* Install node modules for front and back-end servers

Go to client directory and install node modules
```bash
cd client
npm install
```
Go to server directory and install node modules
```bash
cd server
npm install
```

## Getting Running
To start the web application server:
* Start MongoDB server - see the *Tutorials* section for your specific operating system on the [installation page](https://docs.mongodb.com/manual/installation/) for how to start Mongo. (Run on default port 27017)
* Start client-side Vue.js server (starts at url [http://localhost:8080/](http://localhost:8080/) | default username: Admin password: Password)
```bash
cd client
npm run dev
```
* Start back-end Node.js server
```bash
cd server
npm start
```
*Note: You need to run all three servers simultaneously, so you may need to start each in their own respective terminal instances. It is also important to make sure the MongoDB server is started and listenting on port 27017 before attempting to start the Node.js server.

## Configuration
By default, the servers all run on localhost which will not allow other devices on the network to access the web application. You will need to replace the two references to localhost using either the host computer's ip address or hostname.

* Get computer's ip address (unix)
```bash
ifconfig
```

* Get computer's ip address (windows)
```bash
ipconfig
```

* Get computer's hostname
```bash
hostname
```
* Replace HOST_NAME value:`"'localhost'"` in `~/client/config/dev.env.js` with your computer's [ip.address] or [hostname.local]
* Replace HOST_NAME value=`localhost` (plain-text) in `~/server/.env` with your computer's [ip.address] or [hostname.local]
* (Recommended) Change `password` in *'User'* collection in database using either Mongo shell or a database client such as [MongoDB Compass](https://www.mongodb.com/products/compass) so that default password is not used.

Once the hostname has been changed properly, other devices on the same local area network will be able to access the web application at the url [http://[ip.address]:8080/login](http://[ip.address]:8080/login) / [http://hostname.local:8080/login](http://hostname.local:8080/login).

## System Backup
Although the web application has built-in functionality on the `Manage Data` page to import and export *Exhibitor* and *Buyer* data as CSV files for easy use with MS Excel, Apple Numbers, or Google Sheets; it is highly recommended to create additional backups. Backup options include, but are not limited to:
1. **Full system backups** using [Time Machine](https://support.apple.com/en-us/HT201250) (macOS), [Acronis](https://www.acronis.com/en-us/personal/computer-backup/) (Windows), [Rsync/Grsync](https://linux.die.net/man/1/rsync) (Linux), or some other method of creating full system images/backups.
2. **Import/Export data using MongoDB Compass** for which additional information can be found [here](https://docs.mongodb.com/compass/master/import-export/).
3. **Copy underlying data files** via snapshots or `cp` for which additional information can be found [here](https://docs.mongodb.com/manual/core/backups/).
4. **Use [`mongodump`](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/)** to create BSON files which can be restored using the `mongorestore` tool. *Note that while `mongodump` and `mongorestore` are simple and easy-to-use tools, they are limited to smaller data sets, and may not be entirely reliable as a sole backup system.


---
## Contributors
Richard Hakes       rjhakes@mavs.coloradomesa.edu

Matt Frankmore      mfrankmore@mavs.coloradomesa.edu

## Client
Andrew Vidmar       andrew.vidmar18@gmail.com, mslivestockmarketing@gmail.com, 970-260-1239

## Presentation Info
[Showcase Presentation](https://coloradomesa.zoom.us/rec/share/15Nnf5Xp0m9OXq-W-UTgeaI_DJWiaaa8hCAc__QLmUgwCq_AfgllxyZ-fvrBm7xE)  
[Addendum Presentation]()
There were no slides for our presentations.

## License
Code licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
