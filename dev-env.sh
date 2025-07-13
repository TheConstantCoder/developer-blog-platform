# Development Environment Activation Script
echo '🚀 Activating development environment...'

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the project's Node.js version
nvm use

echo '✅ Node.js version:' $(node --version)
echo '✅ npm version:' $(npm --version)
echo '✅ User:' $(whoami)
echo '🎯 Development environment is ready!'
