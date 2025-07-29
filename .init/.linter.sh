#!/bin/bash
cd /home/kavia/workspace/code-generation/clown-and-king-tic-tac-toe-48194-48223/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

