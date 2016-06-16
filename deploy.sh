#!/usr/bin/env bash
set -o errexit

ENVIRONMENT=${1:-"acceptance"}
deploy_dir="/srv/web/apps/scholars_search"

case "$ENVIRONMENT" in
  acceptance)
    SERVERS=("scholars-web-test-04.oit.duke.edu" "scholars-web-test-05.oit.duke.edu")
    ;;
  #production)
  # SERVERS=("scholars-web-04.oit.duke.edu" "scholars-web-05.oit.duke.edu")
  # ;;
  *)
    echo "Usage: $0 {acceptance|production}"
    exit 1
esac


for SERVER in "${SERVERS[@]}"; do
  echo "deploying to $ENVIRONMENT server: $SERVER..."

  echo "creating deploy directory on $SERVER..."
  ssh tomcat@$SERVER "[ -d $deploy_dir ] || mkdir $deploy_dir"
 
  #echo "build dist with webpack"
  #NODE_ENV=$ENVIRONMENT npm run build $ENVIRONMENT 

  echo "rsyncing app.js to $SERVER..."
  rsync -avz dist/app.js tomcat@$SERVER:$deploy_dir/app.js
 
  echo "rsyncing index.html to $SERVER..."
  rsync -av dist/index.html tomcat@$SERVER:$deploy_dir/index.html
   
  echo "rsyncing index.html to $SERVER..."
  rsync -av dist/app.js.map tomcat@$SERVER:$deploy_dir/app.js.map

  #echo "rsyncing image files to $SERVER..."
  #rsync -av dist/*.gif tomcat@$SERVER:$deploy_dir/

  #echo "rsyncing image files to $SERVER..."
  #rsync -av dist/*.png tomcat@$SERVER:$deploy_dir/

  #echo "rsyncing image files to $SERVER..."
  #rsync -av dist/*.jpg tomcat@$SERVER:$deploy_dir/

  echo "rsyncing image and font files to $SERVER..."
  rsync -av dist/*.{woff,woff2,eot,ttf,jpg,png,gif,svg} tomcat@$SERVER:$deploy_dir/



done

