#!/bin/bash
gnome-terminal --geometry=80x25+0+0 --window --working-directory=<./client> \
               --title='<Client>' --command="bash"
npm run dev &