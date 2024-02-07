FROM node:latest

# Expose the necessary ports for Expo
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081

WORKDIR /app

# Create and change to the app directory
WORKDIR /app/ReactFE

RUN chmod -R +x ./
# CMD ["bash"]
# Start the Expo development server
CMD ["npm", "start"]
