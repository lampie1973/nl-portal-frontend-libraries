# stage1 - build react app first 
FROM node:14-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json ./yarn.lock ./lerna.json /app/

COPY ./packages/app/package.json /app/packages/app/
COPY ./packages/authentication/package.json /app/packages/authentication/
COPY ./packages/localization/package.json /app/packages/localization/
COPY ./packages/user-interface/package.json /app/packages/user-interface/

RUN yarn global add lerna && yarn run bootstrap

COPY . /app
RUN yarn run build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.21.1-alpine
COPY --from=build /app/packages/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
COPY entrypoint.sh /docker-entrypoint.d/entrypoint.sh
# needed for modifying env vars at runtime
# RUN chmod 777 /usr/share/nginx/html/config.js

RUN \
    # sets the directory and file permissions to allow users in the root group to access them with the same authorization as the directory and file owner
    chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html && \
    # update the file and directory permissions accordingly
    chown -R 1001:0 /usr/share/nginx/html && \
    # support running as arbitrary user which belogs to the root group
    chmod g+rwx /var/cache/nginx /var/run /var/log/nginx && \
    # comment user directive as master process is run as user in OpenShift anyhow
    sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf
# RUN chown -R 1001:0 /usr/share/nginx/html

# RUN chmod 775 /docker-entrypoint.d/entrypoint.sh

# support running as arbitrary user which belogs to the root group
# RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx

# users are not allowed to listen on priviliged ports
# RUN sed -i.bak 's/listen\(.*\)80;/listen 8081;/' /etc/nginx/conf.d/default.conf

# comment user directive as master process is run as user in OpenShift anyhow
# RUN sed -i.bak 's/^user/#user/' /etc/nginx/nginx.conf
EXPOSE 3000
USER 1001:0
CMD ["nginx", "-g", "daemon off;"]
