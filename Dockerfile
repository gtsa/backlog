# Use the official Nginx Alpine image
FROM nginx:alpine

# Add the HTML file with a placeholder welcome message
RUN echo "<html><body><h1>Welcome to the Backlog!</h1></body></html>" > /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80
