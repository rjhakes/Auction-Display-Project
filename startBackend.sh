#!/bin/bash
gnome-terminal --geometry=80x25+0+0 --window --working-directory=<./server> \
               --title='<Backend Node Server>' --command="bash"
npm start &