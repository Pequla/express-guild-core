# Guild Core
Application for caching account links from a specific Discord server allowing the adition of a server nickname atribute

In order for this application to work you need to invite the [Super Link's Discord bot](https://discord.com/api/oauth2/authorize?client_id=770681237622095913&permissions=8&scope=bot%20applications.commands)

### Configuration

Example of the `.env` file:
```properties
SERVER_PORT=4000
DATABASE_NAME=guild_core
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
DATABASE_HOST=localhost
DATABASE_PORT=3306
BACKEND_BASE_URL=https://link.samifying.com
GUILD_ID=1088934690385317928
```

In the `public/status.html` on line `44` inside the `fetch` function make sure to change the Minecraft server address to the correct one.

### Deployment

After cloning the repository you will need to execute `nmp install` in order to install all the required libraries. After the successfull installation you have to also the build the app for production by executing the `npm run build` command.

> It is recommended to run the application as the systemd service to maximise the availability

In order to grant access of this application via a custom domain you should setup a reverse proxy using `nginx` or `apache2`. The following code is the example of the apache virtual host file:

```
<VirtualHost *:80>
    ServerName example.com
    ProxyPreserveHost On

    RewriteEngine on
    ProxyPass / http://127.0.0.1:4000/
    ProxyPassReverse / http://127.0.0.1:4000/
</VirtualHost>
```

### Initial sync

Before you setup any cron jobs to sync your data you have to initailly call the `POST /api/sync/all`. 

>Avoid calling this endpoint more then once a day, rate limits may apply from the master backend

### Syncing via cron

It is recommended to setup a cron job on every 15 minutes to retrieve any new links that may have occured as well as to remove any deleted links

Example cron configration:

```
*/15 * * * * bash ~/scripts/update-guild-cache.sh
```

Script content:

```bash
#!/bin/bash
echo 'Syncing with master'
curl -X POST http://localhost:4000/api/sync/new
curl -X POST http://localhost:4000/api/sync/removed
echo 'Cache updated'
```

### Next steps

The application has been successfully configured and deployed. What is recommended is to restyle the existing frontend in the public folder to sute your server or clone the one [built in vue](https://github.com/Pequla/guild-vue).

If you are creative and skilled with frontend technologies I highly advise making a custom solution. My feel for design is very limited so all the examples are very primitive.